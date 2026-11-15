/* Printa shared data store (Firebase).
 * Both sites read and write one Firestore database, so a change in the CMS
 * shows on the Customer View straight away and customer orders and messages
 * show in the CMS.
 *   CMS  (window.PRINTA_APP = 'cms'):  owner signs in; sees and edits everything.
 *   Shop (window.PRINTA_APP = 'shop'): each visitor gets an anonymous sign-in and
 *        sees the catalog plus only their own orders, chat and account.
 * Without a Firebase config (firebase-config.js) the site runs as a local demo
 * that does not sync. */
(function () {
  'use strict';

  var APP = window.PRINTA_APP === 'cms' ? 'cms' : 'shop';
  var CFG = window.PRINTA_FIREBASE || {};
  var configured = !!(CFG.apiKey && CFG.projectId && !/^YOUR_/.test(CFG.apiKey)) && !!window.firebase;

  var subs = new Set();
  var EMPTY = function () { return { catalog: null, orders: [], chats: [], accounts: [], audit: [] }; };
  var store = {
    app: APP,
    status: 'connecting',   // connecting | signin | denied | live | offline
    note: '', ready: false, uid: null, email: '',
    data: EMPTY(),
    subscribe: function (fn) { subs.add(fn); return function () { subs.delete(fn); }; },
    put: put, remove: remove, save: save,
    saveCatalog: function (cat) { put('shop/catalog', cat); },
    signIn: signIn, signOut: signOut, resetPassword: resetPassword,
    loadSample: loadSample, nextRef: nextRef
  };
  window.PrintaStore = store;

  var emitQueued = false;
  function emit() {
    if (emitQueued) return;
    emitQueued = true;
    Promise.resolve().then(function () {
      emitQueued = false;
      subs.forEach(function (fn) { try { fn(store.data, store); } catch (e) { console.error('[printa] subscriber failed', e); } });
    });
  }
  function setData(key, val) {
    var d = {}; for (var k in store.data) d[k] = store.data[k];
    d[key] = val; store.data = d; emit();
  }
  function clean(o) { return JSON.parse(JSON.stringify(o)); }

  var SORT = { orders: ['placedAt', true], chats: ['seq', false], accounts: ['seq', false], audit: ['at', true] };
  function sortList(key, list) {
    var f = SORT[key][0], desc = SORT[key][1];
    return list.slice().sort(function (a, b) { var x = +a[f] || 0, y = +b[f] || 0; return desc ? y - x : x - y; });
  }
  function docOut(d) { var o = {}; var b = d.data() || {}; for (var k in b) o[k] = b[k]; o.id = d.id; return o; }

  // ---------- local demo (no Firebase) ----------
  function goOffline(why) {
    stopListeners();
    var s = window.PrintaSample(Date.now());
    store.status = 'offline';
    store.ready = true;
    store.note = why;
    store.data = { catalog: s.catalog, orders: s.orders, chats: s.chats, accounts: s.accounts, audit: s.audit };
    emit();
  }
  function applyLocal(path, obj) {
    var parts = path.split('/');
    if (parts[0] === 'shop') { if (parts[1] === 'catalog') setData('catalog', obj); return; }
    var key = parts[0], id = parts[1];
    if (!SORT[key]) return;
    var list = store.data[key].filter(function (x) { return x.id !== id; });
    if (obj) { var o = clean(obj); o.id = id; list.push(o); }
    setData(key, sortList(key, list));
  }

  // ---------- writes: one at a time per document ----------
  var fs = null, auth = null;
  var queues = {};
  function put(path, obj) {
    var data = clean(obj);
    delete data.id;
    if (store.status !== 'live') { applyLocal(path, data); return; }
    enqueue(path, { op: 'set', data: data });
  }
  // Write now and report the outcome (used where the visitor must know it worked, like placing an order).
  function save(path, obj) {
    var data = clean(obj);
    delete data.id;
    if (store.status !== 'live') { applyLocal(path, data); return Promise.resolve(''); }
    return fs.doc(path).set(data).then(function () { return ''; }).catch(function (e) {
      console.error('[printa] save failed', path, e);
      return e && e.code === 'permission-denied' ? 'The shop didn’t accept it — it may have just closed or changed.'
        : 'It couldn’t be sent. Check your connection and try again.';
    });
  }
  function remove(path) {
    if (store.status !== 'live') { applyLocal(path, null); return; }
    enqueue(path, { op: 'delete' });
  }
  function enqueue(path, job) {
    var q = queues[path] || (queues[path] = { busy: false, pending: null });
    q.pending = job;
    run(path);
  }
  function run(path) {
    var q = queues[path];
    if (q.busy || !q.pending) return;
    var job = q.pending; q.pending = null; q.busy = true;
    var ref = fs.doc(path);
    (job.op === 'set' ? ref.set(job.data) : ref.delete()).catch(function (e) {
      console.error('[printa] save failed', path, e);
      store.note = e && e.code === 'permission-denied'
        ? 'That change wasn’t allowed and was not saved.'
        : e && e.code === 'resource-exhausted' ? 'The shop has hit its daily limit — try again tomorrow.'
        : 'A change could not be saved. Check your connection and try again.';
      emit();
    }).then(function () {
      q.busy = false;
      if (q.pending) run(path);
    });
  }

  // ---------- live listeners ----------
  var unsubs = [];
  function stopListeners() { unsubs.forEach(function (u) { try { u(); } catch (e) {} }); unsubs = []; }

  function startLive() {
    stopListeners();
    store.status = 'live';
    store.ready = false;
    store.note = '';
    store.data = EMPTY();
    var keys = ['catalog', 'orders', 'chats', 'accounts'].concat(APP === 'cms' ? ['audit'] : []);
    var confirmed = {};
    var timer = setTimeout(function () {
      store.note = 'The shop data can’t be reached yet — what you see may be out of date.';
      emit();
    }, 10000);
    var settle = function (key, snap) {
      if (snap && snap.metadata && snap.metadata.fromCache) return;
      confirmed[key] = true;
      if (keys.every(function (k) { return confirmed[k]; })) {
        clearTimeout(timer);
        if (/reached yet/.test(store.note)) store.note = '';
        store.ready = true;
        emit();
      }
    };
    var onErr = function (key) {
      return function (e) {
        console.error('[printa] live updates stopped for ' + key, e);
        clearTimeout(timer);
        store.note = e && e.code === 'permission-denied'
          ? 'This account can’t read the shop data. Check the Firestore rules and the admins list.'
          : 'Live updates stopped. Reload the page to reconnect.';
        confirmed[key] = true;
        emit();
      };
    };
    unsubs.push(fs.doc('shop/catalog').onSnapshot(function (snap) {
      setData('catalog', snap.exists ? snap.data() : null);
      settle('catalog', snap);
    }, onErr('catalog')));

    if (APP === 'cms') {
      ['orders', 'chats', 'accounts'].forEach(function (key) {
        unsubs.push(fs.collection(key).onSnapshot(function (snap) {
          setData(key, sortList(key, snap.docs.map(docOut)));
          settle(key, snap);
        }, onErr(key)));
      });
      unsubs.push(fs.collection('audit').orderBy('at', 'desc').limit(200).onSnapshot(function (snap) {
        setData('audit', snap.docs.map(docOut));
        settle('audit', snap);
      }, onErr('audit')));
    } else {
      var uid = store.uid;
      unsubs.push(fs.collection('orders').where('customerUid', '==', uid).onSnapshot(function (snap) {
        setData('orders', sortList('orders', snap.docs.map(docOut)));
        settle('orders', snap);
      }, onErr('orders')));
      unsubs.push(fs.doc('chats/c-' + uid).onSnapshot(function (snap) {
        setData('chats', snap.exists ? [docOut(snap)] : []);
        settle('chats', snap);
      }, onErr('chats')));
      unsubs.push(fs.doc('accounts/' + uid).onSnapshot(function (snap) {
        setData('accounts', snap.exists ? [docOut(snap)] : []);
        settle('accounts', snap);
      }, onErr('accounts')));
    }
    emit();
  }

  // ---------- sign-in (CMS) ----------
  var AUTH_MSG = {
    'auth/invalid-credential': 'Wrong email or password.',
    'auth/wrong-password': 'Wrong email or password.',
    'auth/user-not-found': 'Wrong email or password.',
    'auth/invalid-email': 'That email address doesn’t look right.',
    'auth/too-many-requests': 'Too many tries. Wait a few minutes, then try again.',
    'auth/network-request-failed': 'No connection. Check your internet and try again.'
  };
  function signIn(email, password) {
    if (!auth) return Promise.resolve();
    return auth.signInWithEmailAndPassword(String(email || '').trim(), String(password || ''))
      .then(function () { return ''; })
      .catch(function (e) { return AUTH_MSG[e && e.code] || 'Couldn’t sign in. Try again.'; });
  }
  function signOut() { if (auth) auth.signOut(); }
  function resetPassword(email) {
    if (!auth) return Promise.resolve('');
    return auth.sendPasswordResetEmail(String(email || '').trim())
      .then(function () { return ''; })
      .catch(function (e) { return AUTH_MSG[e && e.code] || 'Couldn’t send the reset email.'; });
  }

  // ---------- transaction numbers ----------
  function nextRef() {
    var fallback = function () {
      var nums = store.data.orders.map(function (o) { return +String(o.ref || '').replace(/\D/g, ''); }).filter(function (n) { return n > 0; });
      return 'TXN-' + (Math.max.apply(null, [20420].concat(nums)) + 1);
    };
    if (store.status !== 'live') return Promise.resolve(fallback());
    var ref = fs.doc('shop/counter');
    return fs.runTransaction(function (tx) {
      return tx.get(ref).then(function (snap) {
        if (!snap.exists) throw new Error('no counter');
        var n = +snap.data().next || 20421;
        tx.update(ref, { next: n + 1 });
        return 'TXN-' + n;
      });
    }).catch(function (e) {
      console.warn('[printa] counter unavailable, using a time-based number', e);
      return 'TXN-' + String(Date.now()).slice(-6);
    });
  }

  // ---------- starter data (CMS, empty database) ----------
  function loadSample() {
    var s = window.PrintaSample(Date.now());
    if (store.status !== 'live') return Promise.resolve('');
    var batch = fs.batch();
    batch.set(fs.doc('shop/catalog'), clean(s.catalog));
    batch.set(fs.doc('shop/counter'), { next: 20421 });
    ['orders', 'accounts', 'chats', 'audit'].forEach(function (k) {
      s[k].forEach(function (o) { var d = clean(o); var id = d.id; delete d.id; batch.set(fs.doc(k + '/' + id), d); });
    });
    return batch.commit().then(function () { return ''; }).catch(function (e) {
      console.error('[printa] starter data failed', e);
      return 'Couldn’t load the starter data: ' + (e && e.code === 'permission-denied' ? 'this account isn’t allowed to write.' : 'try again.');
    });
  }

  // ---------- start ----------
  if (!configured) {
    goOffline(window.firebase || /^YOUR_/.test(CFG.apiKey || 'YOUR_')
      ? 'Demo mode — Firebase isn’t set up yet, so changes stay on this device.'
      : 'Demo mode — couldn’t load Firebase, so changes stay on this device.');
    return;
  }
  try {
    firebase.initializeApp(CFG);
    auth = firebase.auth();
    fs = firebase.firestore();
  } catch (e) {
    console.error('[printa] Firebase failed to start', e);
    goOffline('Demo mode — Firebase couldn’t start, so changes stay on this device.');
    return;
  }
  auth.onAuthStateChanged(function (user) {
    stopListeners();
    store.ready = false;
    store.data = EMPTY();
    if (!user) {
      store.uid = null; store.email = '';
      if (APP === 'shop') {
        store.status = 'connecting'; emit();
        auth.signInAnonymously().catch(function (e) {
          console.error('[printa] anonymous sign-in failed', e);
          store.note = 'Couldn’t connect to the shop. Reload to try again.';
          emit();
        });
        return;
      }
      store.status = 'signin'; emit();
      return;
    }
    store.uid = user.uid; store.email = user.email || '';
    if (APP === 'cms') {
      if (user.isAnonymous) { auth.signOut(); return; }
      store.status = 'connecting'; emit();
      fs.doc('admins/' + user.uid).get().then(function (snap) {
        if (!snap.exists) { store.status = 'denied'; emit(); return; }
        startLive();
      }).catch(function (e) {
        console.error('[printa] admin check failed', e);
        store.status = 'denied'; emit();
      });
      return;
    }
    startLive();
  });
})();

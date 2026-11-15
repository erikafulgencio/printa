/* Printa starter data: the sample shop loaded by "Load starter data" in the CMS,
 * and the local demo used when Firebase isn't set up yet. */
(function () {
  'use strict';
  function sample(now) {
    var ago = function (m) { return now - m * 60000; };
    var DOC = function (name, ext, pages, size, cfg) {
      var d = { name: name, ext: ext, pages: pages, size: size, copies: 1, range: 'All pages', orientation: 'Portrait', paper: 'Short · 8.5 × 11', color: 'B&W', sides: 'Single-sided', addons: [], notes: '' };
      for (var k in cfg) d[k] = cfg[k];
      return d;
    };
    var catalog = {
      shopOpen: true,
      settings: { autoConfirm: false, lowStockAlerts: true, smsUpdates: true, acceptWalkIn: true, requirePrepay: true },
      services: [
        { id: 's1', name: 'Printing', desc: 'B&W ₱4/page, colored ₱7/page. Short, A4 and Long bond.', price: 'FROM ₱4 / PAGE', turnaround: '15–30 MIN', bw: 4, color: 7, available: true },
        { id: 's2', name: 'Scanning', desc: 'Flatbed scan to PDF or JPG, emailed or saved to USB.', price: '₱5 / PAGE', turnaround: '10 MIN', available: true },
        { id: 's3', name: 'Soft bind', desc: 'Tiered by page count — ₱80 up to 40pp, up to ₱200 for 180pp+.', price: 'FROM ₱80', turnaround: '1–2 HRS', available: true }
      ],
      addons: [
        { id: 'a1', name: 'Black toner', cat: 'Ink', price: '₱1,450', stock: 3, unit: 'cart.', low: 2, available: true },
        { id: 'a2', name: 'Colored ink set (CMY)', cat: 'Ink', price: '₱2,100', stock: 1, unit: 'set', low: 2, available: true },
        { id: 'a3', name: 'Bond paper — Short', cat: 'Paper', price: '₱1 / pc', stock: 1400, unit: 'sheets', low: 500, available: true },
        { id: 'a4', name: 'Bond paper — A4', cat: 'Paper', price: '₱1 / pc', stock: 320, unit: 'sheets', low: 500, available: true },
        { id: 'a5', name: 'Bond paper — Long', cat: 'Paper', price: '₱1 / pc', stock: 860, unit: 'sheets', low: 500, available: true },
        { id: 'a6', name: 'Soft bind cover — Black', cat: 'Binding', price: '₱80+', stock: 24, unit: 'pcs', low: 10, available: true },
        { id: 'a7', name: 'Soft bind cover — White', cat: 'Binding', price: '₱80+', stock: 6, unit: 'pcs', low: 10, available: true },
        { id: 'a8', name: 'Soft bind cover — Blue', cat: 'Binding', price: '₱80+', stock: 0, unit: 'pcs', low: 10, available: false },
        { id: 'a9', name: 'Staple', cat: 'Binding', price: '+₱3', stock: 900, unit: 'pcs', low: 200, available: true },
        { id: 'a10', name: 'Paper clip', cat: 'Binding', price: '+₱2', stock: 340, unit: 'pcs', low: 100, available: true },
        { id: 'a11', name: 'Sliding folder', cat: 'Binding', price: '+₱20', stock: 42, unit: 'pcs', low: 15, available: true },
        { id: 'a12', name: 'Brown envelope', cat: 'Supplies', price: '+₱8', stock: 75, unit: 'pcs', low: 30, available: true },
        { id: 'a13', name: 'Plastic envelope', cat: 'Supplies', price: '+₱15', stock: 18, unit: 'pcs', low: 30, available: true }
      ],
      pickups: [
        { id: 'p1', name: '4th Ave. Soondy Express Cargo Inc.', short: 'Soondy Express', hours: 'MON–SAT · 8:00 AM – 7:00 PM', note: 'Ground floor counter', addr: '35 4th Ave.', city: 'Caloocan, Metro Manila', photo: 'assets/soondy-streetview.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=14.6433129,120.9785505', available: true },
        { id: 'p2', name: '4th Ave. Our Lady of Fatima Chapel', short: 'Fatima Chapel', hours: 'DAILY · 7:00 AM – 6:00 PM', note: 'Beside the gate', addr: '122 Nadurata St.', city: 'Caloocan, Metro Manila', photo: 'assets/blue-chapel-streetview.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=14.6438535,120.9784495', available: true },
        { id: 'p3', name: '4th Ave. 7-Eleven', short: '7-Eleven 4th Ave.', hours: '24 HOURS', note: 'Ask at the counter', addr: '80 4th Ave.', city: 'Caloocan, Metro Manila', photo: 'assets/seven-eleven-streetview.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=14.643268,120.9799454', available: false }
      ],
      couriers: [
        { id: 'c1', name: 'Lalamove', fee: 'Rider-quoted, paid by customer', eta: '30–45 MIN', note: 'Motorcycle, booked once printing is done', available: true },
        { id: 'c2', name: 'Grab', fee: 'Rider-quoted, paid by customer', eta: '25–40 MIN', note: 'GrabExpress, booked once printing is done', available: true }
      ]
    };
    var orders = [
      { id: 't0', ref: 'TXN-20420', customer: 'Ella Cruz', phone: '0916 330 7781', gcash: '905519930221', registered: true, rush: true, total: 604, refunded: 0, stage: 'For Confirmation', placedAt: ago(11), fulfil: 'Pick-up', fulfilFull: 'Pick-up — Soondy Express', pickupId: 'p1',
        docs: [DOC('Capstone_FinalDraft.pdf', 'PDF', 96, '6.4 MB', { paper: 'A4 · 8.3 × 11.7', sides: 'Double-sided', addons: ['Soft bind — Black cover', 'Rush — same day'], notes: 'Defense is at 5 PM, please prioritise.' })],
        docCharges: [[['B&W · A4 · 96 sheets', '₱384'], ['Soft bind · 81–120 pages', '₱120'], ['Rush — same day · 1×', '₱100']]],
        rows: [{ label: 'B&W · A4 · 96 sheets', amount: '₱384' }, { label: 'Soft bind · 81–120 pages', amount: '₱120' }, { label: 'Rush — same day · 1×', amount: '₱100' }],
        remarks: [{ text: 'Rush fee collected. Binding machine set up.', meta: 'RICA M. · TODAY' }] },
      { id: 't1', ref: 'TXN-20419', customer: 'Juan Dela Cruz', phone: '0917 442 8810', gcash: '905512447301', registered: true, rush: false, total: 272, refunded: 0, stage: 'For Confirmation', placedAt: ago(38), fulfil: 'Pick-up', fulfilFull: 'Pick-up — Soondy Express', pickupId: 'p1',
        docs: [DOC('Thesis_Ch3_final.pdf', 'PDF', 24, '1.8 MB', { copies: 2, range: 'Pages 1–24', addons: ['Soft bind — Black cover', 'Stapled'], notes: 'Bind tightly, margins are narrow.' })],
        docCharges: [[['B&W · Short · 48 sheets', '₱192'], ['Soft bind · 1 document', '₱80']]],
        rows: [{ label: 'B&W · Short · 48 sheets', amount: '₱192' }, { label: 'Soft bind · 1 document', amount: '₱80' }], remarks: [] },
      { id: 't2', ref: 'TXN-20418', customer: 'Mara Villanueva', phone: '0906 218 7745', gcash: '905551002913', registered: true, rush: false, total: 154, refunded: 0, stage: 'Confirmed', placedAt: ago(81), fulfil: 'Grab delivery', fulfilFull: 'Grab delivery — 12 Kalayaan Ave.', courierId: 'c2', address: '12 Kalayaan Ave., blue gate',
        docs: [
          DOC('Endorsement_Letter.docx', 'DOCX', 2, '48 KB', { copies: 3, paper: 'A4 · 8.3 × 11.7', color: 'Colored', sides: 'Double-sided', addons: ['Plastic envelope — short', 'Paper clip'] }),
          DOC('Resume_2026.pdf', 'PDF', 2, '160 KB', { copies: 6, paper: 'A4 · 8.3 × 11.7', color: 'Colored', addons: ['Stapled'], notes: 'Print on the bond paper she bought.' })
        ],
        docCharges: [[['Colored · A4 · 6 sheets', '₱42'], ['Plastic envelope · short', '₱15'], ['Paper clip', '₱2']], [['Colored · A4 · 12 sheets', '₱84'], ['Stapled', '₱3'], ['Bond paper · short · 8 pcs', '₱8']]],
        rows: [{ label: 'Colored · A4 · 6 sheets', amount: '₱42' }, { label: 'Plastic envelope · short', amount: '₱15' }, { label: 'Paper clip', amount: '₱2' }, { label: 'Colored · A4 · 12 sheets', amount: '₱84' }, { label: 'Stapled', amount: '₱3' }, { label: 'Bond paper · short · 8 pcs', amount: '₱8' }],
        remarks: [{ text: 'Customer asked for double-sided if possible.', meta: 'RICA M. · TODAY' }] },
      { id: 't3', ref: 'TXN-20417', customer: 'Paolo Sison', phone: '0999 130 5522', gcash: '905513790264', registered: false, rush: false, total: 195, refunded: 0, stage: 'Ready', placedAt: ago(206), fulfil: 'Pick-up', fulfilFull: 'Pick-up — 7-Eleven 4th Ave.', pickupId: 'p3',
        docs: [DOC('Business_Permit_Copy.pdf', 'PDF', 28, '2.1 MB', { orientation: 'Landscape', paper: 'Long · 8.5 × 13', addons: ['Soft bind — White cover', 'Stapled'] })],
        docCharges: [[['B&W · Long · 28 sheets', '₱112'], ['Soft bind · 1 document', '₱80'], ['Stapled', '₱3']]],
        rows: [{ label: 'B&W · Long · 28 sheets', amount: '₱112' }, { label: 'Soft bind · 1 document', amount: '₱80' }, { label: 'Stapled', amount: '₱3' }], remarks: [] },
      { id: 't4', ref: 'TXN-20416', customer: 'Kim Ortega', phone: '0928 776 1190', gcash: '905509118432', registered: true, rush: false, total: 95, refunded: 0, stage: 'Successful', placedAt: ago(340), closedAt: ago(340) + 41 * 60000, fulfil: 'Lalamove delivery', fulfilFull: 'Lalamove delivery — 5 Mabini St.', courierId: 'c1', address: 'Unit 5, 5 Mabini St. (3rd floor walk-up)',
        docs: [DOC('Resume_2026.docx', 'DOCX', 2, '52 KB', { copies: 10, addons: ['Plastic envelope — short'] })],
        docCharges: [[['B&W · Short · 20 sheets', '₱80'], ['Plastic envelope · short', '₱15']]],
        rows: [{ label: 'B&W · Short · 20 sheets', amount: '₱80' }, { label: 'Plastic envelope · short', amount: '₱15' }], remarks: [] },
      { id: 't7', ref: 'TXN-20413', customer: 'Dexter Yu', phone: '0908 441 2266', gcash: '905498221730', registered: false, rush: false, total: 84, refunded: 0, stage: 'Cancelled', placedAt: ago(1180), closedAt: ago(1180) + 26 * 60000, fulfil: 'Pick-up', fulfilFull: 'Pick-up — Fatima Chapel', pickupId: 'p2',
        docs: [DOC('Scanned_IDs.jpg', 'JPG', 4, '3.2 MB', { copies: 2, color: 'Colored' })],
        docCharges: [[['Colored · Short · 8 sheets', '₱56'], ['Brown envelope · short', '₱8'], ['Sliding folder', '₱20']]],
        rows: [{ label: 'Colored · Short · 8 sheets', amount: '₱56' }, { label: 'Brown envelope · short', amount: '₱8' }, { label: 'Sliding folder', amount: '₱20' }], remarks: [{ text: 'Cancelled — customer found a shop nearer campus.', meta: 'RICA M. · YESTERDAY' }] },
      { id: 't5', ref: 'TXN-20415', customer: 'Bea Ramos', phone: '0917 009 3312', gcash: '905502771845', registered: true, rush: false, total: 380, refunded: 120, stage: 'Refunded', placedAt: ago(1285), closedAt: ago(1285) + 138 * 60000, fulfil: 'Pick-up', fulfilFull: 'Pick-up — Fatima Chapel', pickupId: 'p2',
        docs: [DOC('Modules_Week1-4.pdf', 'PDF', 40, '9.7 MB', { paper: 'A4 · 8.3 × 11.7', color: 'Colored', addons: ['Sliding folder — Light blue', 'Soft bind — Blue cover'] })],
        docCharges: [[['Colored · A4 · 40 sheets', '₱280'], ['Sliding folder', '₱20'], ['Soft bind · 1 document', '₱80']]],
        rows: [{ label: 'Colored · A4 · 40 sheets', amount: '₱280' }, { label: 'Sliding folder', amount: '₱20' }, { label: 'Soft bind · 1 document', amount: '₱80' }],
        remarks: [{ text: 'Partial refund ₱120 — 12 pages printed with streaks.', meta: 'RICA M. · YESTERDAY 6:02 PM' }] },
      { id: 't6', ref: 'TXN-20414', customer: 'Noel Bautista', phone: '0933 511 8020', gcash: '905500194772', registered: true, rush: false, total: 64, refunded: 0, stage: 'Unclaimed', placedAt: ago(1570), fulfil: 'Pick-up', fulfilFull: 'Pick-up — Soondy Express', pickupId: 'p1',
        docs: [DOC('Barangay_Clearance.pdf', 'PDF', 14, '640 KB', { addons: ['Brown envelope — short'] })],
        docCharges: [[['B&W · Short · 14 sheets', '₱56'], ['Brown envelope · short', '₱8']]],
        rows: [{ label: 'B&W · Short · 14 sheets', amount: '₱56' }, { label: 'Brown envelope · short', amount: '₱8' }], remarks: [] }
    ];
    var accounts = [
      { id: 'u1', seq: 1, name: 'Juan Dela Cruz', email: 'juan.delacruz@gmail.com', phone: '0917 442 8810', role: 'Customer', status: 'Active', joined: 'JOINED MAR 2026', orders: 14 },
      { id: 'u2', seq: 2, name: 'Mara Villanueva', email: 'mara.v@gmail.com', phone: '0906 218 7745', role: 'Customer', status: 'Active', joined: 'JOINED JUN 2026', orders: 6 },
      { id: 'u3', seq: 3, name: 'Rica Mendoza', email: 'rica@printa.ph', phone: '0917 220 0011', role: 'Owner', status: 'Active', joined: 'JOINED JAN 2026', orders: 0 },
      { id: 'u4', seq: 4, name: 'Dennis Lao', email: 'dennis@printa.ph', phone: '0920 774 3318', role: 'Staff', status: 'Active', joined: 'JOINED FEB 2026', orders: 0 },
      { id: 'u5', seq: 5, name: 'Bea Ramos', email: 'bearamos21@gmail.com', phone: '0917 009 3312', role: 'Customer', status: 'Inactive', joined: 'JOINED APR 2026', orders: 3 },
      { id: 'u6', seq: 6, name: 'Noel Bautista', email: 'noelb@yahoo.com', phone: '0933 511 8020', role: 'Customer', status: 'Blocked', joined: 'JOINED MAY 2026', orders: 2 }
    ];
    var chats = [
      { id: 'ch1', seq: 1, name: 'Juan Dela Cruz', tag: 'TXN-20419', unread: 2, custUnread: 1, muted: false, blocked: false, messages: [
        { me: false, kind: 'text', text: 'Hi po, is the thesis ready for pick-up?', time: '3:38 PM' },
        { me: false, kind: 'file', text: 'Thesis_Ch3_final.pdf', size: '1.8 MB', ext: 'PDF', time: '3:39 PM' },
        { me: true, kind: 'text', text: 'Binding it now — ready by 4:30 PM at Soondy Express.', time: '3:47 PM' }] },
      { id: 'ch2', seq: 2, name: 'Mara Villanueva', tag: 'TXN-20418', unread: 0, custUnread: 0, muted: true, blocked: false, messages: [
        { me: false, kind: 'text', text: 'Can you do double-sided for the letter?', time: '3:01 PM' },
        { me: true, kind: 'text', text: 'Yes — no extra charge. Rider is booked for 4 PM.', time: '3:05 PM' }] },
      { id: 'ch3', seq: 3, name: 'Paolo Sison', tag: 'TXN-20417', unread: 1, custUnread: 0, muted: false, blocked: false, messages: [
        { me: false, kind: 'image', text: 'permit-photo.jpg', time: '1:02 PM' },
        { me: false, kind: 'text', text: 'Print this one po, long bond.', time: '1:03 PM' }] },
      { id: 'ch4', seq: 4, name: 'Noel Bautista', tag: 'TXN-20414', unread: 0, custUnread: 0, muted: false, blocked: true, messages: [
        { me: false, kind: 'text', text: 'Refund na lang po.', time: 'Yesterday' },
        { me: true, kind: 'text', text: 'Order was never claimed and was already printed — no refund for unclaimed jobs.', time: 'Yesterday' }] }
    ];
    var audit = [
      ['CHAT', 'Rica M. replied to Juan Dela Cruz on TXN-20419', 30],
      ['TXN', 'TXN-20418 moved For Confirmation → Confirmed', 75],
      ['TXN', 'TXN-20417 moved Confirmed → Ready', 180],
      ['STOCK', 'Bond paper — A4 adjusted 520 → 320 sheets', 280],
      ['SERVICE', 'Soft bind switched on — binding machine back in service', 400],
      ['REFUND', 'Partial refund ₱120 issued on TXN-20415 via GCash transfer', 1150],
      ['ACCOUNT', 'Noel Bautista blocked — repeated unclaimed orders', 1200]
    ].map(function (r, i) { return { id: 'seed' + i, tag: r[0], text: r[1], at: ago(r[2]), by: 'Rica M.' }; });
    return { catalog: catalog, orders: orders, accounts: accounts, chats: chats, audit: audit };
  }
  window.PrintaSample = sample;
})();

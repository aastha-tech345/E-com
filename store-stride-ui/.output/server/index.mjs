globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-24T05:00:06.897Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-24T05:00:06.897Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/AdminLayout-Dr1G9Te8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23b3-5uZleu0i0t0bjCMQ4CI06kWzsuk\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 9139,
		"path": "../public/assets/AdminLayout-Dr1G9Te8.js"
	},
	"/assets/AdminSidebar-CRiDl2c5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d5-2hZOFx1eRzRmIBl6/ry3+9nHuh8\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 8405,
		"path": "../public/assets/AdminSidebar-CRiDl2c5.js"
	},
	"/assets/DataTable-CyqemLhm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f9-GXXmyww9k16zMfmv71WWsOMkW/U\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 5369,
		"path": "../public/assets/DataTable-CyqemLhm.js"
	},
	"/assets/EmptyState-BCXHSUhn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-D7/sI+4//M+Jd/O/4BvsRSZi3I4\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1168,
		"path": "../public/assets/EmptyState-BCXHSUhn.js"
	},
	"/assets/Footer-DOdI7xNu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f11-VqXSRYr1imbCONL01Nbvb0LsmII\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 28433,
		"path": "../public/assets/Footer-DOdI7xNu.js"
	},
	"/assets/Price-Dh2lJ1Us.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a6-zrjI+hA2Ti+qQNHeOpQiF1qSAYA\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 678,
		"path": "../public/assets/Price-Dh2lJ1Us.js"
	},
	"/assets/ProductCard-HqpI80Yd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9fa-t98GNudnIZiVLQfTIpG+jK5RKAM\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 2554,
		"path": "../public/assets/ProductCard-HqpI80Yd.js"
	},
	"/assets/ShoppingAssistant-BGiam8Bn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"230d-nb7Bw1V1pjbjNGIEtnRoIHStebU\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 8973,
		"path": "../public/assets/ShoppingAssistant-BGiam8Bn.js"
	},
	"/assets/admin-BuFQI9nZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"339-8izJ1b/g6e1NMDF6OdZWye0vf1g\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 825,
		"path": "../public/assets/admin-BuFQI9nZ.js"
	},
	"/assets/admin.admin-users-C7eRPxbv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83e-CC0N0gOFrki12av3oG5m/IVJ85s\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 2110,
		"path": "../public/assets/admin.admin-users-C7eRPxbv.js"
	},
	"/assets/admin.attributes-CEaioC18.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"334-qaDE2XM3u5Zav9ez7j0CrCgXwS0\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 820,
		"path": "../public/assets/admin.attributes-CEaioC18.js"
	},
	"/assets/admin.banners-C4OO45cK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-SJ5RQ0xlmJmR1ycD1+wHJPSROY0\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 807,
		"path": "../public/assets/admin.banners-C4OO45cK.js"
	},
	"/assets/admin.brands-DStxIKLT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4d-26oTZtXIb0nJML9+6iusqjcN4qE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 3661,
		"path": "../public/assets/admin.brands-DStxIKLT.js"
	},
	"/assets/admin.categories-DkW6520u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e73-hSEEz1JL7KXhAwrk1/vauuTwT+M\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 3699,
		"path": "../public/assets/admin.categories-DkW6520u.js"
	},
	"/assets/admin.coupons-PUgacyk0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-MvhlmsZ+mo5l2cXWkwdZ8aKrGEk\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 807,
		"path": "../public/assets/admin.coupons-PUgacyk0.js"
	},
	"/assets/admin.customers-DUpToZe8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-Jdt6+Lzn/J8pU9CLGnEsTdU0u98\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 813,
		"path": "../public/assets/admin.customers-DUpToZe8.js"
	},
	"/assets/admin.index-NfCJ8puj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-ZYMQeDM7kpQxS40zGsa0wh9Mmhw\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 160,
		"path": "../public/assets/admin.index-NfCJ8puj.js"
	},
	"/assets/admin.inventory-CJDsSzxw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-8S/kHtH6tCWi842T9E1DJmuGdHE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 813,
		"path": "../public/assets/admin.inventory-CJDsSzxw.js"
	},
	"/assets/admin.login-Ab2cno1v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a0-LmpimpW91QASpeAYf2kysY7XT74\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 2208,
		"path": "../public/assets/admin.login-Ab2cno1v.js"
	},
	"/assets/admin.orders-Dui3kY1l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-kdEZEKwA+J5NkMQexNg6N0QvPQI\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 807,
		"path": "../public/assets/admin.orders-Dui3kY1l.js"
	},
	"/assets/admin.product-attributes-CxAUzV4w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-ID5liy6qkd0pw0GCzeC11oCZUs4\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1643,
		"path": "../public/assets/admin.product-attributes-CxAUzV4w.js"
	},
	"/assets/admin.products-zrC1EwqF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108b-vEoBZSIdtLk6N3vM2veoaVVlT1A\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 4235,
		"path": "../public/assets/admin.products-zrC1EwqF.js"
	},
	"/assets/admin.dashboard-mwtL2LnB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65c72-2PZWv3poxxLS/cLUNFdrnirwjXA\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 416882,
		"path": "../public/assets/admin.dashboard-mwtL2LnB.js"
	},
	"/assets/admin.products._id.edit-DjvVXRAU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27a2-aVthZnv7H5bWICHBQnMdpRK5dFE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 10146,
		"path": "../public/assets/admin.products._id.edit-DjvVXRAU.js"
	},
	"/assets/admin.products.create-CkEjwMHh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7eb-oOYOpysjwzK9meRBv2C8lB4dKO4\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 42987,
		"path": "../public/assets/admin.products.create-CkEjwMHh.js"
	},
	"/assets/admin.products.index-0BywtI4T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"872-umiobTccF0gGmxUKNqLPVaYeUB0\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 2162,
		"path": "../public/assets/admin.products.index-0BywtI4T.js"
	},
	"/assets/admin.promotions-DQMEG8gB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32f-CLetN0VboOcHDZni57fO63Ahl/c\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 815,
		"path": "../public/assets/admin.promotions-DQMEG8gB.js"
	},
	"/assets/admin.reviews-CyxPGSAi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-2KDixbO8fUfk8JE467wIFzxjysQ\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 807,
		"path": "../public/assets/admin.reviews-CyxPGSAi.js"
	},
	"/assets/admin.settings-1tVjgaHD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"315-LWMGfWkGCWAMWZi98GfwTdfctV8\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 789,
		"path": "../public/assets/admin.settings-1tVjgaHD.js"
	},
	"/assets/admin.subcategories-FQws1klM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-72kSETKjrUC+689/miAculPGEsk\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1738,
		"path": "../public/assets/admin.subcategories-FQws1klM.js"
	},
	"/assets/button-CQmoHenp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ce8-s5At/HUXlf+SzuFn7PEaQ9dd2VU\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 31976,
		"path": "../public/assets/button-CQmoHenp.js"
	},
	"/assets/cart-DSC_MPc2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14dc-xMoBqZgXhUWCK2QmNKFCcTd7XF8\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 5340,
		"path": "../public/assets/cart-DSC_MPc2.js"
	},
	"/assets/category._slug-er6l-88G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c38-N8qNkWxmdhgZxBXlVOk0IeibpvA\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 3128,
		"path": "../public/assets/category._slug-er6l-88G.js"
	},
	"/assets/checkout-rEZxkV9O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"452b-GnZxYJmLvpwIgMvXJruzRoLOoEU\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 17707,
		"path": "../public/assets/checkout-rEZxkV9O.js"
	},
	"/assets/checkout.cancel-B4pWbcBA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e1-JOutcFUyteJr2gRz3ljc4i7ezpA\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1249,
		"path": "../public/assets/checkout.cancel-B4pWbcBA.js"
	},
	"/assets/checkout.success-DDdjPYe0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ff-5zcgHuD2erGfLxF7F7ZkO3JWjOg\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1279,
		"path": "../public/assets/checkout.success-DDdjPYe0.js"
	},
	"/assets/chevron-left-BMxzDcJ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73-l8ppR9nk7e2k6CbZ19vlCqq8eXE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 115,
		"path": "../public/assets/chevron-left-BMxzDcJ5.js"
	},
	"/assets/circle-check-big-0whPkehT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b3-7WnCDzOfduRl3LB9fui2Vdo4dVc\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 179,
		"path": "../public/assets/circle-check-big-0whPkehT.js"
	},
	"/assets/dropdown-menu-D47n9koF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"158be-8roodiKnW/aZY+cUAW3bmanl4gc\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 88254,
		"path": "../public/assets/dropdown-menu-D47n9koF.js"
	},
	"/assets/eye-CK5atgdZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-yVknAlI6JMfnjKI4slH5UcOF0s4\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 241,
		"path": "../public/assets/eye-CK5atgdZ.js"
	},
	"/assets/funnel-ksvgxA2c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-H7/V3x2CiQ9k9rj+G9jJEiHgqfQ\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 241,
		"path": "../public/assets/funnel-ksvgxA2c.js"
	},
	"/assets/index-DEf0EilC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"689bd-EvdE+7ujNzs6vxeXUviESRe72Zk\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 428477,
		"path": "../public/assets/index-DEf0EilC.js"
	},
	"/assets/input-ClR10kK4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-Yy2cHPhijSadIdU8CaCeia4PK5k\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 620,
		"path": "../public/assets/input-ClR10kK4.js"
	},
	"/assets/login-CSZEgDsB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa4-mI4l0fBUnyoxl8pJ9//9+xk5Htk\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 4004,
		"path": "../public/assets/login-CSZEgDsB.js"
	},
	"/assets/map-pin-Bpy8IVL0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-wD/6Fd8PiY82QgjRSG5TV0ZldWE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 244,
		"path": "../public/assets/map-pin-Bpy8IVL0.js"
	},
	"/assets/matchContext-C0chPf5_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-oQtRkEb2uToY6/IphTNmDvEHps4\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 140,
		"path": "../public/assets/matchContext-C0chPf5_.js"
	},
	"/assets/orders._id-CeFOMCJh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c00-P5E00LV6Yl6PYeI+FxWWZT/k5P0\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 7168,
		"path": "../public/assets/orders._id-CeFOMCJh.js"
	},
	"/assets/orders.index-uqOqH31K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8f-YFOmq6djhoACmdvzvQtCZP6v1qg\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 3215,
		"path": "../public/assets/orders.index-uqOqH31K.js"
	},
	"/assets/plus-Dvl0yjNN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-jEja5rV3A08lrQDqn5Gz8wn8V+I\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 138,
		"path": "../public/assets/plus-Dvl0yjNN.js"
	},
	"/assets/products._id-BBBQDwAr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2601-6HpzhVyB5IZE5cBYUwfKCN0jJvo\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 9729,
		"path": "../public/assets/products._id-BBBQDwAr.js"
	},
	"/assets/products.index-9L1tYRnA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2f8-e9c7saEh7+jNf6aAFeLrCjnzkYQ\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 54008,
		"path": "../public/assets/products.index-9L1tYRnA.js"
	},
	"/assets/profile-DtSNYuYJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f29-wNYV/4w0qR2P/Bexsln7Vd33lFw\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 7977,
		"path": "../public/assets/profile-DtSNYuYJ.js"
	},
	"/assets/register-CtswU3sd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bff-D8+UXlPEbxiV85AgaP1TiVwqz0g\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 7167,
		"path": "../public/assets/register-CtswU3sd.js"
	},
	"/assets/rotate-ccw-8cR0B35d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9-F//TUaWfzDDGkzsJKQmzMdi1Ecw\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 185,
		"path": "../public/assets/rotate-ccw-8cR0B35d.js"
	},
	"/assets/routes-C-IkV5S1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1970-474KQD3vgAhoarRC/mqHWBbE42A\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 6512,
		"path": "../public/assets/routes-C-IkV5S1.js"
	},
	"/assets/search-BDd473ni.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d9-W7Q7qk5f/4bXHNAOgNR5Uw2qffY\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1497,
		"path": "../public/assets/search-BDd473ni.js"
	},
	"/assets/square-pen-B2HIJxLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-jw7pZVBb/bjzQqW2XHofMjNxySc\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 305,
		"path": "../public/assets/square-pen-B2HIJxLp.js"
	},
	"/assets/star-BXUED4mL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-/XqPtkCp2TNC5HZ1L9Gd4/RpngE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 457,
		"path": "../public/assets/star-BXUED4mL.js"
	},
	"/assets/tabs-CSKqn77c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da8-cOzisVIitE/qD51W7xKA2oK3Ios\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 3496,
		"path": "../public/assets/tabs-CSKqn77c.js"
	},
	"/assets/styles-Dib6ZpwN.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1a875-MXqaVCebhRHhj5m9cmfYHOYAxNg\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 108661,
		"path": "../public/assets/styles-Dib6ZpwN.css"
	},
	"/assets/trash-2-Du4pR_FV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-ggvnKN/CHH7YlT6cSe/1InzyTZs\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 313,
		"path": "../public/assets/trash-2-Du4pR_FV.js"
	},
	"/assets/truck-Dm460iCV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"187-woKlZDV6wY9FV/jsfG2BJCyxB5E\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 391,
		"path": "../public/assets/truck-Dm460iCV.js"
	},
	"/assets/useRouter-Ch6OGJRG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e3-5RzYsxsrJHQH7+ahoc/fMoMgfwE\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 9187,
		"path": "../public/assets/useRouter-Ch6OGJRG.js"
	},
	"/assets/useStore-CRTcEvnu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4871-rAzNpEH44b8ZVyPU8OoZlJqu7tI\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 18545,
		"path": "../public/assets/useStore-CRTcEvnu.js"
	},
	"/assets/wishlist-XeXSMzOG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-UMokgZel/XOruLddzoTRPUGyGOc\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 1199,
		"path": "../public/assets/wishlist-XeXSMzOG.js"
	},
	"/assets/x-DJoAIeNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a2-uIFHT/vHSZFxkiLQF6LsIznmeNQ\"",
		"mtime": "2026-08-24T05:00:05.641Z",
		"size": 2210,
		"path": "../public/assets/x-DJoAIeNK.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_2LfovB = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_2LfovB
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };

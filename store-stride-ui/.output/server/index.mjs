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
		"mtime": "2026-08-21T10:27:03.664Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-21T10:27:03.664Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/AdminLayout-BDTYFlfa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11ee-O6R96sMxJFW5ZSyvHb9fFYmMwu4\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 4590,
		"path": "../public/assets/AdminLayout-BDTYFlfa.js"
	},
	"/assets/AdminSidebar-D-v2wKAc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10ba-2jYhIgE+0EEstCjphuotXqa+lGY\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 4282,
		"path": "../public/assets/AdminSidebar-D-v2wKAc.js"
	},
	"/assets/DataTable-DyRz14al.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"893-KWCMBc4uzln5hJ1f9hudAu75xLE\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 2195,
		"path": "../public/assets/DataTable-DyRz14al.js"
	},
	"/assets/EmptyState-CRsZ6m8k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-RPU1RKk+cuuc32Ohyhtu/Z+X/oI\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 1168,
		"path": "../public/assets/EmptyState-CRsZ6m8k.js"
	},
	"/assets/Footer-DRQJGuAl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c5ff-QZMxCuTzj2EFvj2h7+LXr7hG10Q\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 116223,
		"path": "../public/assets/Footer-DRQJGuAl.js"
	},
	"/assets/Price-DzZaAZln.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a6-6Xjoo4+Lv8ay9tfc0OsjZChlzNE\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 678,
		"path": "../public/assets/Price-DzZaAZln.js"
	},
	"/assets/ProductCard-DiNc69Uw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9fa-8629nx0A/Fx1/jQFRyZxXRsTPuE\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 2554,
		"path": "../public/assets/ProductCard-DiNc69Uw.js"
	},
	"/assets/ShoppingAssistant-D2V1MrUx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c10-2Gy5Y2a+v+c4DcYxDQaRggcj5uY\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 7184,
		"path": "../public/assets/ShoppingAssistant-D2V1MrUx.js"
	},
	"/assets/admin-CCWmr7vI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-wxPYK4c9kAGOYuXmWvro2CXkuQ0\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 219,
		"path": "../public/assets/admin-CCWmr7vI.js"
	},
	"/assets/admin.admin-users-KBXeO0HG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83e-i53HwEo50t4LaCw5goFZm7Yvtn0\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 2110,
		"path": "../public/assets/admin.admin-users-KBXeO0HG.js"
	},
	"/assets/admin.attributes-C2WFHriG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"334-lGfqYwmiXSZiVbfQrYQ9k07EmnM\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 820,
		"path": "../public/assets/admin.attributes-C2WFHriG.js"
	},
	"/assets/admin.banners-CSaEy_C9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-rOfy4WfJtO9ALnoMrtSv6qrTqpA\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 807,
		"path": "../public/assets/admin.banners-CSaEy_C9.js"
	},
	"/assets/admin.brands-Bf00KdXW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4d-r38bPmzfNf6JedSqy//B6kJmM3I\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 3661,
		"path": "../public/assets/admin.brands-Bf00KdXW.js"
	},
	"/assets/admin.categories-GknBb833.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e73-6FvWdEsEeAnW517uIGIBasxA7ek\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 3699,
		"path": "../public/assets/admin.categories-GknBb833.js"
	},
	"/assets/admin.coupons-B5gSEzNH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-aP6jHKNMdW+iBWEq1k/IYRLTee8\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 807,
		"path": "../public/assets/admin.coupons-B5gSEzNH.js"
	},
	"/assets/admin.customers-cOXQpfdi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-Kh9bzbxCzcdCt6vkqJIRIXGVVlk\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 813,
		"path": "../public/assets/admin.customers-cOXQpfdi.js"
	},
	"/assets/admin.index-CM1PjsbA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-Q4ZK2Mw0SMzoJb1/4la5VXs/4u0\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 160,
		"path": "../public/assets/admin.index-CM1PjsbA.js"
	},
	"/assets/admin.inventory-Bqi_NWpk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-nzeeOF2RAQa9kHlZTtqm01xA5G0\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 813,
		"path": "../public/assets/admin.inventory-Bqi_NWpk.js"
	},
	"/assets/admin.login-CAVK2gq6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"72f-A2XvIHN3LrqXH9SOszu3LvWflOU\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 1839,
		"path": "../public/assets/admin.login-CAVK2gq6.js"
	},
	"/assets/admin.dashboard-Czj4ixnD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"642d1-yOm5VQv34esXUYocOMH2DVoGHHg\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 410321,
		"path": "../public/assets/admin.dashboard-Czj4ixnD.js"
	},
	"/assets/admin.orders-DX97JuUP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-hmGtoNJ+JKuPIVm/nhLdrhvjoDw\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 807,
		"path": "../public/assets/admin.orders-DX97JuUP.js"
	},
	"/assets/admin.product-attributes-bD2SvESY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-0uLfGLsq3Yz9jTKFVkZxx3z+Eqk\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 1643,
		"path": "../public/assets/admin.product-attributes-bD2SvESY.js"
	},
	"/assets/admin.products-LkqKx5-f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108b-qO7WPG+R6njc14KjsDGsY7i5sbk\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 4235,
		"path": "../public/assets/admin.products-LkqKx5-f.js"
	},
	"/assets/admin.products._id.edit-BZmjTTcO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27a2-obc8//CZoVMvg76BzWUtwRrhRs4\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 10146,
		"path": "../public/assets/admin.products._id.edit-BZmjTTcO.js"
	},
	"/assets/admin.products.create-CqdC_GRB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7e6-iScD7mGoGPB6csursKfoeUvof3A\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 42982,
		"path": "../public/assets/admin.products.create-CqdC_GRB.js"
	},
	"/assets/admin.products.index-qXQe8XNF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"872-jO4dpipu33BzpvgvjmUVkw95Nyw\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 2162,
		"path": "../public/assets/admin.products.index-qXQe8XNF.js"
	},
	"/assets/admin.promotions-DyO43q7x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32f-zYnYVLCHMhFxwcxVXq8qAEca4YA\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 815,
		"path": "../public/assets/admin.promotions-DyO43q7x.js"
	},
	"/assets/admin.reviews-BUsg4CM9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-LZDzbbw3fe1BWq1wl0Pf+LX6q1k\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 807,
		"path": "../public/assets/admin.reviews-BUsg4CM9.js"
	},
	"/assets/admin.settings-DV8pOesp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"315-FWhVNdf4sJXcgEnSlkPFs0cUUo8\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 789,
		"path": "../public/assets/admin.settings-DV8pOesp.js"
	},
	"/assets/admin.subcategories-CRQ2Hsms.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-HkdqRm6mTzMhv8HuDCgK18nUmWo\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 1738,
		"path": "../public/assets/admin.subcategories-CRQ2Hsms.js"
	},
	"/assets/button-DXGzTEb2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ce1-TAVlmO6SEpciP19vwiQ+x5QPX3Y\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 31969,
		"path": "../public/assets/button-DXGzTEb2.js"
	},
	"/assets/cart-CO7u4GgV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14dc-CtIpMz1/r+YUmjwlzFFDIwnvtDY\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 5340,
		"path": "../public/assets/cart-CO7u4GgV.js"
	},
	"/assets/category._slug-DQR6G_dM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c2c-WKwe5AVfRJOz51mVAfYg9Oq0ScU\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 3116,
		"path": "../public/assets/category._slug-DQR6G_dM.js"
	},
	"/assets/checkout-BjUScZMA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4398-D5Msb2MML/igCoTNSs6KGW3cUgY\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 17304,
		"path": "../public/assets/checkout-BjUScZMA.js"
	},
	"/assets/chevron-left-BMxzDcJ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73-l8ppR9nk7e2k6CbZ19vlCqq8eXE\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 115,
		"path": "../public/assets/chevron-left-BMxzDcJ5.js"
	},
	"/assets/eye-CK5atgdZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-yVknAlI6JMfnjKI4slH5UcOF0s4\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 241,
		"path": "../public/assets/eye-CK5atgdZ.js"
	},
	"/assets/eye-off-Du0x_ZPF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19f-a8DPJbZSlltjKKpJbR3mqk7oNdc\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 415,
		"path": "../public/assets/eye-off-Du0x_ZPF.js"
	},
	"/assets/input-Cq8vufch.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-QofRCqMBi2qMUaPwNZegQ8uVxe8\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 620,
		"path": "../public/assets/input-Cq8vufch.js"
	},
	"/assets/lock-CKd6vZPg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bf-iXvSoAf594igyoL5HxvzV/56N8A\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 191,
		"path": "../public/assets/lock-CKd6vZPg.js"
	},
	"/assets/login-CsjAkDe-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f32-m5f0GUQlmOGBlPoLIgt3geaFibE\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 3890,
		"path": "../public/assets/login-CsjAkDe-.js"
	},
	"/assets/mail-BogJHzGe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c6-oF1G7B7ojP+ZCBpDTkcKGK+rgDQ\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 198,
		"path": "../public/assets/mail-BogJHzGe.js"
	},
	"/assets/map-pin-Bpy8IVL0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-wD/6Fd8PiY82QgjRSG5TV0ZldWE\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 244,
		"path": "../public/assets/map-pin-Bpy8IVL0.js"
	},
	"/assets/matchContext-C0chPf5_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-oQtRkEb2uToY6/IphTNmDvEHps4\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 140,
		"path": "../public/assets/matchContext-C0chPf5_.js"
	},
	"/assets/orders._id-DD_p5b5p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18cc-N3wg5gMPN8dNNWebw85USTYhfRQ\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 6348,
		"path": "../public/assets/orders._id-DD_p5b5p.js"
	},
	"/assets/orders.index-Bs6WLOKf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6e-62F/RHtqql2USJ2ENwOlo957Jjg\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 2670,
		"path": "../public/assets/orders.index-Bs6WLOKf.js"
	},
	"/assets/phone-KOjfeh65.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"133-GIMem2NsvbsSsK5fs4ectQeMc/k\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 307,
		"path": "../public/assets/phone-KOjfeh65.js"
	},
	"/assets/plus-Dvl0yjNN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-jEja5rV3A08lrQDqn5Gz8wn8V+I\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 138,
		"path": "../public/assets/plus-Dvl0yjNN.js"
	},
	"/assets/index-B19j7Bf3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a6b3-cTm8qFQOJHYJlxWLepknLFEEB4A\"",
		"mtime": "2026-08-21T10:27:02.280Z",
		"size": 435891,
		"path": "../public/assets/index-B19j7Bf3.js"
	},
	"/assets/products._id-BY-8XTuB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25fa-3g6mR9uDRk2WfTbuZMmWwll9FjQ\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 9722,
		"path": "../public/assets/products._id-BY-8XTuB.js"
	},
	"/assets/products.index-Bsj6Kwjd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d35e-g/our12M8HBobvO7t5pvWnyc6L8\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 54110,
		"path": "../public/assets/products.index-Bsj6Kwjd.js"
	},
	"/assets/profile-Cu7Jzf9B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1dba-76uNteCifvyPhevadTBwjEew+0A\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 7610,
		"path": "../public/assets/profile-Cu7Jzf9B.js"
	},
	"/assets/register-BEDYyD-H.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1427-fzTxoB+NKhzTiy+5W3lzobQnfdM\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 5159,
		"path": "../public/assets/register-BEDYyD-H.js"
	},
	"/assets/rotate-ccw-8cR0B35d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9-F//TUaWfzDDGkzsJKQmzMdi1Ecw\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 185,
		"path": "../public/assets/rotate-ccw-8cR0B35d.js"
	},
	"/assets/routes-Dlwf6con.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1970-AFnpU1n9IvaPxGr/Z+WteddmF7k\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 6512,
		"path": "../public/assets/routes-Dlwf6con.js"
	},
	"/assets/search-CFEIEXOV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d4-7uEH6Sl7UWBvn8WQJWyKDdhGiL8\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 1492,
		"path": "../public/assets/search-CFEIEXOV.js"
	},
	"/assets/search-fcyvEZ95.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec-c0tdS/4JRo5Z4ICEmCc+DF25Q2Y\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 236,
		"path": "../public/assets/search-fcyvEZ95.js"
	},
	"/assets/square-pen-B2HIJxLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-jw7pZVBb/bjzQqW2XHofMjNxySc\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 305,
		"path": "../public/assets/square-pen-B2HIJxLp.js"
	},
	"/assets/star-BXUED4mL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-/XqPtkCp2TNC5HZ1L9Gd4/RpngE\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 457,
		"path": "../public/assets/star-BXUED4mL.js"
	},
	"/assets/styles-BXTltXCE.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"17ae0-gYwCKGKaKcZ6DgO5ZVIc1vcZqq0\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 96992,
		"path": "../public/assets/styles-BXTltXCE.css"
	},
	"/assets/tabs-CzcH3bAF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da1-MXuqex1VaYcBHGoxx0QlG7M0WXo\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 3489,
		"path": "../public/assets/tabs-CzcH3bAF.js"
	},
	"/assets/trash-2-Du4pR_FV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-ggvnKN/CHH7YlT6cSe/1InzyTZs\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 313,
		"path": "../public/assets/trash-2-Du4pR_FV.js"
	},
	"/assets/truck-Dm460iCV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"187-woKlZDV6wY9FV/jsfG2BJCyxB5E\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 391,
		"path": "../public/assets/truck-Dm460iCV.js"
	},
	"/assets/useRouter-Ch6OGJRG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e3-5RzYsxsrJHQH7+ahoc/fMoMgfwE\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 9187,
		"path": "../public/assets/useRouter-Ch6OGJRG.js"
	},
	"/assets/useStore-CO_lZDMQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"155e-GYr8GNeyRhb5fvLgwbNTjr5czeQ\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 5470,
		"path": "../public/assets/useStore-CO_lZDMQ.js"
	},
	"/assets/users-jz5tX1m8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"506-3Q1nabdEJneNzwO2C13Znnxfx8o\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 1286,
		"path": "../public/assets/users-jz5tX1m8.js"
	},
	"/assets/wishlist-B243y0O9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-UUjaxcXt9Yo4WNBFW26BzIox9l8\"",
		"mtime": "2026-08-21T10:27:02.284Z",
		"size": 1199,
		"path": "../public/assets/wishlist-B243y0O9.js"
	},
	"/assets/x-DJoAIeNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a2-uIFHT/vHSZFxkiLQF6LsIznmeNQ\"",
		"mtime": "2026-08-21T10:27:02.284Z",
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

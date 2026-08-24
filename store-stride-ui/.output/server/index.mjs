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
		"mtime": "2026-08-24T10:26:04.308Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-24T10:26:04.308Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/AdminLayout-By1L39q9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23f1-9NudIXY/MeiC3bJak4jv33zS/V4\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 9201,
		"path": "../public/assets/AdminLayout-By1L39q9.js"
	},
	"/assets/AdminSidebar-CBY9HKR3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2221-Q10nTTdJN6ChGrE643dfaXT0WEM\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 8737,
		"path": "../public/assets/AdminSidebar-CBY9HKR3.js"
	},
	"/assets/Combination-BEFTAilb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76f4-ctmboiWevkf3VOB33Gc3L9Qat4g\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 30452,
		"path": "../public/assets/Combination-BEFTAilb.js"
	},
	"/assets/DataTable-C5LYD5et.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"165f-WdGcrlpxhkHHbaBzVa7tKrwcRvQ\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 5727,
		"path": "../public/assets/DataTable-C5LYD5et.js"
	},
	"/assets/EmptyState-BB1O6sfx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-Rgcn+uSZkteSimXLaOq43MDHkKQ\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 1168,
		"path": "../public/assets/EmptyState-BB1O6sfx.js"
	},
	"/assets/Footer-BLGrzHXs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5944-/udAlAk7LaAqJnNIu5zOfKUTakI\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 22852,
		"path": "../public/assets/Footer-BLGrzHXs.js"
	},
	"/assets/Price-CP3ySWbf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a6-q/1ejyt7xo2EyLf0ovs7uS1zZ+I\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 678,
		"path": "../public/assets/Price-CP3ySWbf.js"
	},
	"/assets/ProductCard-CnYyv01k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ad3-JxSniDEIOP5Y3pB/P80XI7wPnJs\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2771,
		"path": "../public/assets/ProductCard-CnYyv01k.js"
	},
	"/assets/QuantitySelector-J_f0mx8q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34d-3aAOhiZdvmujJ6HfPxOxkYOBZb8\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 845,
		"path": "../public/assets/QuantitySelector-J_f0mx8q.js"
	},
	"/assets/ShoppingAssistant-BoCxziGl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"234e-SUscLnfndFxQa//ceji0N5142YY\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 9038,
		"path": "../public/assets/ShoppingAssistant-BoCxziGl.js"
	},
	"/assets/admin-CsSjlSBs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"390-V1SPxZ7/cNmAIkXqL8MDhY4nnVU\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 912,
		"path": "../public/assets/admin-CsSjlSBs.js"
	},
	"/assets/admin.admin-users-GLfp2PDr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83e-SFarCm8wXOH+TPGaBbDUhSp/Fg0\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2110,
		"path": "../public/assets/admin.admin-users-GLfp2PDr.js"
	},
	"/assets/admin.attributes-W8IDcRnm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"339-iBsMzC7crTTJizxHALrscEfHm9A\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 825,
		"path": "../public/assets/admin.attributes-W8IDcRnm.js"
	},
	"/assets/admin.banners-CX2oRdWR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-Ssw4Uk1+z7sXciej9JBGGJzncs4\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 812,
		"path": "../public/assets/admin.banners-CX2oRdWR.js"
	},
	"/assets/admin.brands-Dq4KEl3z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e98-rHGPUuBbF92hboJ3wRqYx7YxOzA\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 3736,
		"path": "../public/assets/admin.brands-Dq4KEl3z.js"
	},
	"/assets/admin.categories-DJL1va6q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec7-5fsNbrqPUuTimAYuODa3MS+K1Fk\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 3783,
		"path": "../public/assets/admin.categories-DJL1va6q.js"
	},
	"/assets/admin.coupons-DNayO89Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-K9e9Wp0Ujjy0KSFbpAvaq4QGrbY\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 812,
		"path": "../public/assets/admin.coupons-DNayO89Y.js"
	},
	"/assets/admin.customers-BkGVE-Hz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"332-KfWL/NuOOACNqvgj0F9wRNT/7xk\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 818,
		"path": "../public/assets/admin.customers-BkGVE-Hz.js"
	},
	"/assets/admin.dashboard-CNSPtzEc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21ed-+6A2C1ZSb977ZVjKQq7lOHNEiMM\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 8685,
		"path": "../public/assets/admin.dashboard-CNSPtzEc.js"
	},
	"/assets/admin.index-DVhNzjgl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-gMoDn2ie9VRl+3KOWD54cCulKxM\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 160,
		"path": "../public/assets/admin.index-DVhNzjgl.js"
	},
	"/assets/admin.inventory-DvAZ15in.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"332-4JgVn9g87zuIpdkBbVo6wsGZdgo\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 818,
		"path": "../public/assets/admin.inventory-DvAZ15in.js"
	},
	"/assets/admin.login-BqzyA01W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a1-4/o9BnTmAjrqs4Q4mRdIqLnLLbg\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2209,
		"path": "../public/assets/admin.login-BqzyA01W.js"
	},
	"/assets/admin.orders-D4SA595V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-6yRbynV80/fGxqeLVCLAWC8FCxI\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 812,
		"path": "../public/assets/admin.orders-D4SA595V.js"
	},
	"/assets/admin.policy-llB0Cx47.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d06-4NycRWRQSJ7mcx3o4G3zF7EvGE4\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 3334,
		"path": "../public/assets/admin.policy-llB0Cx47.js"
	},
	"/assets/admin.product-attributes-Del0NsIY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-kXc8tEkWSo5eyaqpqZ6NJUqPC2s\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 1643,
		"path": "../public/assets/admin.product-attributes-Del0NsIY.js"
	},
	"/assets/admin.products-DdyqCRfk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98-jWv7+A3gzxP4W6DMzF0Z4KFShiI\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 152,
		"path": "../public/assets/admin.products-DdyqCRfk.js"
	},
	"/assets/admin.products._id.edit-CRF53zaK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2707-LKkrVvqgP1vN10/wTAsrXg1Njdw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 9991,
		"path": "../public/assets/admin.products._id.edit-CRF53zaK.js"
	},
	"/assets/admin.products.create-cDJtU-89.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9b1-HwHLRAV6t4w6KY+RGYaHQcSdk6c\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 43441,
		"path": "../public/assets/admin.products.create-cDJtU-89.js"
	},
	"/assets/admin.products.index--fA4cSnj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"984-NGryrNer14rwGbO5A4g+APPo0k0\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2436,
		"path": "../public/assets/admin.products.index--fA4cSnj.js"
	},
	"/assets/admin.promotions-CcAq5U2v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"334-96rHJZ0MlSZMjoih/oPEXp7z8+o\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 820,
		"path": "../public/assets/admin.promotions-CcAq5U2v.js"
	},
	"/assets/admin.reviews-BlnSKEd-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-b/T+GsdCwgHPO8UOQzrqhVSOznw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 812,
		"path": "../public/assets/admin.reviews-BlnSKEd-.js"
	},
	"/assets/admin.settings-BrYC76q7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31a-qBWtr3rnN7drcYqeMWflmzbr7Cw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 794,
		"path": "../public/assets/admin.settings-BrYC76q7.js"
	},
	"/assets/admin.subcategories-C7-KRi89.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-PmHRqctBOEN1oltewSY4RioHozA\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 1738,
		"path": "../public/assets/admin.subcategories-C7-KRi89.js"
	},
	"/assets/badge-DQEuXaJO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fe-HllgdZ2L8qUAmHgM8TZ6z2SppOI\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 766,
		"path": "../public/assets/badge-DQEuXaJO.js"
	},
	"/assets/button-wuv4IZ9R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ce0-qiPd9WBCcmUJKG1itjcsV3hMyzc\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 31968,
		"path": "../public/assets/button-wuv4IZ9R.js"
	},
	"/assets/cart-DRxDYxld.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15f4-wRpkpfkAPrLpCyMAyMftK4AEvHw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 5620,
		"path": "../public/assets/cart-DRxDYxld.js"
	},
	"/assets/category._slug-c6Bn-4aF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c33-9MQV3qB+WCVF6PCWCrGXWhCZAxo\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 3123,
		"path": "../public/assets/category._slug-c6Bn-4aF.js"
	},
	"/assets/checkout-CodXHXPt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"461b-tTYJcx0aYoKdxyQsbwe2l/uTdf0\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 17947,
		"path": "../public/assets/checkout-CodXHXPt.js"
	},
	"/assets/checkout.cancel-BpZupLHp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e1-59ban2/NYWDCinHwUHa823583Zs\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 1249,
		"path": "../public/assets/checkout.cancel-BpZupLHp.js"
	},
	"/assets/checkout.success-Cv0d3kdI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d1-X8bLFSorX0onVxLF0WzUF+3EjvA\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2257,
		"path": "../public/assets/checkout.success-Cv0d3kdI.js"
	},
	"/assets/chevron-left-Z-gUH1y2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73-z6pYn5xfRBP2jmVlSPiCRJD/uwQ\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 115,
		"path": "../public/assets/chevron-left-Z-gUH1y2.js"
	},
	"/assets/circle-check-big-C3AHEyun.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b3-QZYguQExJYnkOLRTkrTGVBLZBSk\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 179,
		"path": "../public/assets/circle-check-big-C3AHEyun.js"
	},
	"/assets/dialog-CZENfByS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83f-gFA2gV4GqpmvPiy4GaHxGOGSSWw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2111,
		"path": "../public/assets/dialog-CZENfByS.js"
	},
	"/assets/dist-Dl2lXEne.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a0-Zj+piyxw1dS9mkhj0xcLjnMWk5o\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 4768,
		"path": "../public/assets/dist-Dl2lXEne.js"
	},
	"/assets/dropdown-menu-BqAWYWL8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e269-tE/JNGDgBUYdlKhawXKqYgBPlVE\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 57961,
		"path": "../public/assets/dropdown-menu-BqAWYWL8.js"
	},
	"/assets/eye-52wtCXKa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-joP2DdLUCMM9QRE5y4ZcStXm/sE\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 241,
		"path": "../public/assets/eye-52wtCXKa.js"
	},
	"/assets/input-DH5IpUIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-8m5mpO2RTENMSqRZfPgvmj5W3vs\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 620,
		"path": "../public/assets/input-DH5IpUIr.js"
	},
	"/assets/index-Nxsv1vSD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a57d-a97yr6/UdBr7bDobJRh0UUUZTWY\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 435581,
		"path": "../public/assets/index-Nxsv1vSD.js"
	},
	"/assets/login-9ccVCqcW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa4-OOzET8bW4/yy6ROt+wPvMe0tTcU\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 4004,
		"path": "../public/assets/login-9ccVCqcW.js"
	},
	"/assets/map-pin-BxMaF61f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-MQoy3WdwPo3VYc2WYjtaI63V+5Q\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 244,
		"path": "../public/assets/map-pin-BxMaF61f.js"
	},
	"/assets/matchContext-DKLy_sxI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-MXGto4ObLlJgsu8jIb52ww9Osvw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 140,
		"path": "../public/assets/matchContext-DKLy_sxI.js"
	},
	"/assets/orders._id-HrrMwV3L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c00-vuePtEC4fyghKk34re22FtqaNEk\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 7168,
		"path": "../public/assets/orders._id-HrrMwV3L.js"
	},
	"/assets/orders.index-CmZujLr_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8f-4RAFR2JibMPnu3fdrQefUbHdwYg\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 3215,
		"path": "../public/assets/orders.index-CmZujLr_.js"
	},
	"/assets/plus-C8rK4FnS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-kVdf7TIffmguNeiKTTk/k6cVysw\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 138,
		"path": "../public/assets/plus-C8rK4FnS.js"
	},
	"/assets/products._id-NBpmKn-W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22af-p1zeWNgb9QtJRy4G0gkDL4mzDSU\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 8879,
		"path": "../public/assets/products._id-NBpmKn-W.js"
	},
	"/assets/products.index-CLl9NFt_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d603-sWp9FZYpqVuRd06Lc97nFK7kGsc\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 54787,
		"path": "../public/assets/products.index-CLl9NFt_.js"
	},
	"/assets/profile-BCKBfnOk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f33-KiqngmhCVZbQRCsOssih5Bg/oJ0\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 7987,
		"path": "../public/assets/profile-BCKBfnOk.js"
	},
	"/assets/register-CYplFq36.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bff-lD08eHulDpux2F7owhg268INyEA\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 7167,
		"path": "../public/assets/register-CYplFq36.js"
	},
	"/assets/routes-BPqQp-0Q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"244d-rVnmcgwSas18stFOwtaysNvVfK8\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 9293,
		"path": "../public/assets/routes-BPqQp-0Q.js"
	},
	"/assets/search-DUfXUD0r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e3-JRXVaHyqeVHja7r7XvPptlj/koE\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 1507,
		"path": "../public/assets/search-DUfXUD0r.js"
	},
	"/assets/shield-check-BonUxloL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-lWdErlWHu8OCvqqFdZHsnGWqW48\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 452,
		"path": "../public/assets/shield-check-BonUxloL.js"
	},
	"/assets/square-pen-kWK7UPIj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-5KblTntEeJMZDZPQFhh5FMiD240\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 305,
		"path": "../public/assets/square-pen-kWK7UPIj.js"
	},
	"/assets/star-ybjCZtCx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-RbgcUzrdqXypsEOVq4AmsuMYZJc\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 457,
		"path": "../public/assets/star-ybjCZtCx.js"
	},
	"/assets/styles-CTxk1NZD.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1abd0-jbgazcJH12t+wXVL85hTnUVPF7I\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 109520,
		"path": "../public/assets/styles-CTxk1NZD.css"
	},
	"/assets/tabs-BalobmWz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dcf-DBrKeF98X9FJ+cV+J76Mu7ZhiwA\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 3535,
		"path": "../public/assets/tabs-BalobmWz.js"
	},
	"/assets/trash-2-BFJAc71h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-4q/xmZLVWUQ9hn7HUajzyn6urSY\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 313,
		"path": "../public/assets/trash-2-BFJAc71h.js"
	},
	"/assets/truck-CBW5TOs2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"187-gGJbNy88Y+sEwnPW9sEQiEHNvbc\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 391,
		"path": "../public/assets/truck-CBW5TOs2.js"
	},
	"/assets/upload-CBY4cWfr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d7-vNf001MvwI0Qt7qvsPC4bZG353U\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 215,
		"path": "../public/assets/upload-CBY4cWfr.js"
	},
	"/assets/useLocation-n1tROwCe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-7LWmRptfy+cDXhkSN7suUo4LLvI\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 196,
		"path": "../public/assets/useLocation-n1tROwCe.js"
	},
	"/assets/useRouter-Du1uWnkX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2364-bCM/iINvAAPnaPifvK2VC1r5rfY\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 9060,
		"path": "../public/assets/useRouter-Du1uWnkX.js"
	},
	"/assets/useStore-Dv5OwtUc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4871-V70KtDAkTWa2/D0dix4J4va3oPM\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 18545,
		"path": "../public/assets/useStore-Dv5OwtUc.js"
	},
	"/assets/wishlist-XyHSaWqG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-Sw4iYoQhKTKN0PAGKQKVnX0LMCA\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 1199,
		"path": "../public/assets/wishlist-XyHSaWqG.js"
	},
	"/assets/x-Cjjc6_BH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a2-5wkCAFa+XIdgL6LSnmAw8kp1VM0\"",
		"mtime": "2026-08-24T10:26:03.044Z",
		"size": 2210,
		"path": "../public/assets/x-Cjjc6_BH.js"
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

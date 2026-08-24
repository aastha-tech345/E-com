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
		"mtime": "2026-08-24T11:10:06.594Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-24T11:10:06.594Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/AdminLayout-BURoAPSO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23f1-A52V/VVzUuwP4gYS4TgKbg+z2cs\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 9201,
		"path": "../public/assets/AdminLayout-BURoAPSO.js"
	},
	"/assets/AdminSidebar-BKD5S2Ff.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2221-8JAhMx1y7jZFgg7TwVrK3I1oPVQ\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 8737,
		"path": "../public/assets/AdminSidebar-BKD5S2Ff.js"
	},
	"/assets/Combination-en4Vd7v_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"76f4-I0MK6pVEJJNBn+LwXV7781uCn+g\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 30452,
		"path": "../public/assets/Combination-en4Vd7v_.js"
	},
	"/assets/DataTable-BDkFpk2x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"165f-XPkVdYv9+SK6LvPy/4OEW5HlgAc\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 5727,
		"path": "../public/assets/DataTable-BDkFpk2x.js"
	},
	"/assets/EmptyState-BB1O6sfx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-Rgcn+uSZkteSimXLaOq43MDHkKQ\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 1168,
		"path": "../public/assets/EmptyState-BB1O6sfx.js"
	},
	"/assets/Footer-B04K8Ctr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5944-iWJGtJ1iu4E/09KfXHWIcsiFJ3o\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 22852,
		"path": "../public/assets/Footer-B04K8Ctr.js"
	},
	"/assets/Price-S7Dm8wS3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a6-D5UPNmCB+jSo4hs6nMI51hAWGyo\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 678,
		"path": "../public/assets/Price-S7Dm8wS3.js"
	},
	"/assets/ProductCard-CN4Y6tvo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ad3-S4qd0eY+HD2hTq0S/7qPA90oiTM\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 2771,
		"path": "../public/assets/ProductCard-CN4Y6tvo.js"
	},
	"/assets/QuantitySelector-J_f0mx8q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34d-3aAOhiZdvmujJ6HfPxOxkYOBZb8\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 845,
		"path": "../public/assets/QuantitySelector-J_f0mx8q.js"
	},
	"/assets/ShoppingAssistant-DvJviZir.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"234e-pZTDfER55ljT9n+kI6612u93zDI\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 9038,
		"path": "../public/assets/ShoppingAssistant-DvJviZir.js"
	},
	"/assets/admin-DYZYkwet.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"390-GnrJIwOW2fpUui/6Vnky8MfxcZ8\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 912,
		"path": "../public/assets/admin-DYZYkwet.js"
	},
	"/assets/admin.admin-users-C-ySV8sU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83e-dnnYmNtO5kagpVZzXbTuQyfAaUc\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 2110,
		"path": "../public/assets/admin.admin-users-C-ySV8sU.js"
	},
	"/assets/admin.attributes-BwrGeaRS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"339-E2574DCBj5dhPcqMe08J+ddYVHs\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 825,
		"path": "../public/assets/admin.attributes-BwrGeaRS.js"
	},
	"/assets/admin.banners-eX_p17n2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-c+XTD5IFMzp5Uf17cjAsETLlPY4\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 812,
		"path": "../public/assets/admin.banners-eX_p17n2.js"
	},
	"/assets/admin.brands-Ds4Sir7w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e98-oc8YiIYDFSG3Rrf2kTqbijwN2yc\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 3736,
		"path": "../public/assets/admin.brands-Ds4Sir7w.js"
	},
	"/assets/admin.categories-ZsPWJpGv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec7-u5dZbP1XhIqU9Ao9D+DNq817Iek\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 3783,
		"path": "../public/assets/admin.categories-ZsPWJpGv.js"
	},
	"/assets/admin.coupons-DdOV5Sgq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-70M3Tg3sOBMADy0HOyy3X77tFfA\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 812,
		"path": "../public/assets/admin.coupons-DdOV5Sgq.js"
	},
	"/assets/admin.customers-DizQ8AIZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"332-FfxT+rXGJOtBJ2NFdbYp2O0FYPk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 818,
		"path": "../public/assets/admin.customers-DizQ8AIZ.js"
	},
	"/assets/admin.dashboard-CC7ic9E9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21ed-YjQL3ym2/xZEbyV4rB9pGeT9dXU\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 8685,
		"path": "../public/assets/admin.dashboard-CC7ic9E9.js"
	},
	"/assets/admin.index-DfxEEC-A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-xpS40z55mtB6aLaEH6cTxUEvky0\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 160,
		"path": "../public/assets/admin.index-DfxEEC-A.js"
	},
	"/assets/admin.inventory-DIWKOlJz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"332-LBDUny27FsqRDv1ke3W5GyX52lk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 818,
		"path": "../public/assets/admin.inventory-DIWKOlJz.js"
	},
	"/assets/admin.login-BuCGXN7u.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a1-TeQ0lvW2RzxSMLWQNRS3vA/uib8\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 2209,
		"path": "../public/assets/admin.login-BuCGXN7u.js"
	},
	"/assets/admin.orders-6N8pLeE0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-MMoCYqZPrAdvKO8v0UW7xqU+TOg\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 812,
		"path": "../public/assets/admin.orders-6N8pLeE0.js"
	},
	"/assets/admin.policy-mzGkSCSp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d06-dqDae1eLtN6jmrRL5zVG5Vy+Hfw\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 3334,
		"path": "../public/assets/admin.policy-mzGkSCSp.js"
	},
	"/assets/admin.product-attributes-Cx8L8SfC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-98oFwGSqh9qF2rF/BY/nuVdl0G4\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 1643,
		"path": "../public/assets/admin.product-attributes-Cx8L8SfC.js"
	},
	"/assets/admin.products-C1QkL7ye.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98-NSSfayDt1+islKE/+eAl3bwxIE0\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 152,
		"path": "../public/assets/admin.products-C1QkL7ye.js"
	},
	"/assets/admin.products._id.edit-C02_MPEF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2707-iv9ybtuMaxq5Ip+GuayjGLo8nX0\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 9991,
		"path": "../public/assets/admin.products._id.edit-C02_MPEF.js"
	},
	"/assets/admin.products.create-DLvRaqeQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a9b1-uP4hj+W4YZA0fV57+Mav5bNhA9I\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 43441,
		"path": "../public/assets/admin.products.create-DLvRaqeQ.js"
	},
	"/assets/admin.products.index-DC8Dtbfd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"984-qUC8BBvCeBwWj8XDX5o/LlaJ59s\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 2436,
		"path": "../public/assets/admin.products.index-DC8Dtbfd.js"
	},
	"/assets/admin.promotions-wC5D2EQO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"334-DeNa/V+JFkc0z2aDMumbBh4lMY8\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 820,
		"path": "../public/assets/admin.promotions-wC5D2EQO.js"
	},
	"/assets/admin.reviews-C5uEnH14.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32c-ncfSK83ic01E0Ch9nWVCKBFBD2k\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 812,
		"path": "../public/assets/admin.reviews-C5uEnH14.js"
	},
	"/assets/admin.settings-eRkpv8AB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31a-WcY+FgnXQ7lMiQE+fokRdfurAdE\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 794,
		"path": "../public/assets/admin.settings-eRkpv8AB.js"
	},
	"/assets/admin.subcategories-GoYXp2XP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-qNda+dx6vSQE0Df9LDNCXYgIx+I\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 1738,
		"path": "../public/assets/admin.subcategories-GoYXp2XP.js"
	},
	"/assets/arrow-right-Dm9OPHcN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"96-Uad4VprLrjEM/dFE1Mb32aSZosk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 150,
		"path": "../public/assets/arrow-right-Dm9OPHcN.js"
	},
	"/assets/badge-DQEuXaJO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fe-HllgdZ2L8qUAmHgM8TZ6z2SppOI\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 766,
		"path": "../public/assets/badge-DQEuXaJO.js"
	},
	"/assets/button-wuv4IZ9R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ce0-qiPd9WBCcmUJKG1itjcsV3hMyzc\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 31968,
		"path": "../public/assets/button-wuv4IZ9R.js"
	},
	"/assets/cart-CqL9Qdds.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15f4-K0cehzVEVxbTMCDVg/Q3IXC1sXI\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 5620,
		"path": "../public/assets/cart-CqL9Qdds.js"
	},
	"/assets/category._slug-BjjBuyvn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c33-J7HEEpO4xKrvV2vzrMtstc9rn9o\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 3123,
		"path": "../public/assets/category._slug-BjjBuyvn.js"
	},
	"/assets/checkout-CRC7TZ_9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"52f4-oTZCcdmXAyjPsHyC1kvhNkf00Yg\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 21236,
		"path": "../public/assets/checkout-CRC7TZ_9.js"
	},
	"/assets/checkout.cancel-Dmcfff2N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e1-vBGFEUTguVUCft8eyxZ1fJYNGEM\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 1249,
		"path": "../public/assets/checkout.cancel-Dmcfff2N.js"
	},
	"/assets/checkout.success-KmM11Ppq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d1-SmrpOourweallkqZMMsQs2deRAU\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 2257,
		"path": "../public/assets/checkout.success-KmM11Ppq.js"
	},
	"/assets/chevron-left-Z-gUH1y2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73-z6pYn5xfRBP2jmVlSPiCRJD/uwQ\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 115,
		"path": "../public/assets/chevron-left-Z-gUH1y2.js"
	},
	"/assets/circle-check-big-C3AHEyun.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b3-QZYguQExJYnkOLRTkrTGVBLZBSk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 179,
		"path": "../public/assets/circle-check-big-C3AHEyun.js"
	},
	"/assets/dialog-DEpFIb5h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83f-l10lvoBMo3DOYc/D+LBdN9VhRFc\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 2111,
		"path": "../public/assets/dialog-DEpFIb5h.js"
	},
	"/assets/dist-B3L9bp1O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a0-jBdcl1o0QKdxMCc48pLcpf8YgaY\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 4768,
		"path": "../public/assets/dist-B3L9bp1O.js"
	},
	"/assets/dropdown-menu-ChIsyfMF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e269-5XEdPje/M4u4U1QPIZqdveHGC0A\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 57961,
		"path": "../public/assets/dropdown-menu-ChIsyfMF.js"
	},
	"/assets/eye-52wtCXKa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-joP2DdLUCMM9QRE5y4ZcStXm/sE\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 241,
		"path": "../public/assets/eye-52wtCXKa.js"
	},
	"/assets/index-CCUm-csl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a5a3-xKy7UmfwoWA7A8dQidv1HjJuCiE\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 435619,
		"path": "../public/assets/index-CCUm-csl.js"
	},
	"/assets/input-DH5IpUIr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-8m5mpO2RTENMSqRZfPgvmj5W3vs\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 620,
		"path": "../public/assets/input-DH5IpUIr.js"
	},
	"/assets/matchContext-DKLy_sxI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-MXGto4ObLlJgsu8jIb52ww9Osvw\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 140,
		"path": "../public/assets/matchContext-DKLy_sxI.js"
	},
	"/assets/orders._id-DSXzMCxi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c00-kthB0noIXf/BWp92xPMT8dOwVAM\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 7168,
		"path": "../public/assets/orders._id-DSXzMCxi.js"
	},
	"/assets/orders.index-DW6_6TEA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8f-O81E03eJ0URCvM+85YiTKaC5Kes\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 3215,
		"path": "../public/assets/orders.index-DW6_6TEA.js"
	},
	"/assets/login-Dr4RTKXc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa4-Azn/mI1x5GWwgc0wwYVGnvyuxVo\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 4004,
		"path": "../public/assets/login-Dr4RTKXc.js"
	},
	"/assets/phone-CV185Tpu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"201-gNEyAy0LEOHfHub09Rz36NjpI9w\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 513,
		"path": "../public/assets/phone-CV185Tpu.js"
	},
	"/assets/plus-C8rK4FnS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-kVdf7TIffmguNeiKTTk/k6cVysw\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 138,
		"path": "../public/assets/plus-C8rK4FnS.js"
	},
	"/assets/products._id-Dh-0zB6A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22ad-W+oNgcjotp3pl8C+Z3NLhAkDvAk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 8877,
		"path": "../public/assets/products._id-Dh-0zB6A.js"
	},
	"/assets/products.index-DQrOkC6m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d603-ESwDURbo+kmVqbiJrztE2dbLgFE\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 54787,
		"path": "../public/assets/products.index-DQrOkC6m.js"
	},
	"/assets/profile-a476Q1vX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e37-PrxTiGYujbz+J6GPZ2PDOw2DAVY\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 7735,
		"path": "../public/assets/profile-a476Q1vX.js"
	},
	"/assets/register-DtM-So8-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bff-DKs4oavoOms+DF1NEyWXGMLJoJ0\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 7167,
		"path": "../public/assets/register-DtM-So8-.js"
	},
	"/assets/rotate-ccw-CWevmF9W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9-BRskJTAXfFJNnjUCS+rD9pADxuk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 185,
		"path": "../public/assets/rotate-ccw-CWevmF9W.js"
	},
	"/assets/routes-yU9-mQuS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23f6-j6TMMSuns4UOfkZTzLWRKJAPxg4\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 9206,
		"path": "../public/assets/routes-yU9-mQuS.js"
	},
	"/assets/search-DpVpI-QI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e3-MPwJDgoqgvJlZyenAd0JXMD54uQ\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 1507,
		"path": "../public/assets/search-DpVpI-QI.js"
	},
	"/assets/square-pen-kWK7UPIj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-5KblTntEeJMZDZPQFhh5FMiD240\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 305,
		"path": "../public/assets/square-pen-kWK7UPIj.js"
	},
	"/assets/star-ybjCZtCx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-RbgcUzrdqXypsEOVq4AmsuMYZJc\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 457,
		"path": "../public/assets/star-ybjCZtCx.js"
	},
	"/assets/styles-jLtLm1DA.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1a75e-ftKj3hD4utDBZmM8uBqdLfYLzeI\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 108382,
		"path": "../public/assets/styles-jLtLm1DA.css"
	},
	"/assets/tabs-BzEG7zAr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dcf-ej4s2k9V0fk+E4E/R/YAbd68Ojk\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 3535,
		"path": "../public/assets/tabs-BzEG7zAr.js"
	},
	"/assets/trash-2-BFJAc71h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-4q/xmZLVWUQ9hn7HUajzyn6urSY\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 313,
		"path": "../public/assets/trash-2-BFJAc71h.js"
	},
	"/assets/truck-Dbjt_8u0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"292-fk30IMxP4DXQj7Mp9FDMJRoiDuI\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 658,
		"path": "../public/assets/truck-Dbjt_8u0.js"
	},
	"/assets/upload-CBY4cWfr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d7-vNf001MvwI0Qt7qvsPC4bZG353U\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 215,
		"path": "../public/assets/upload-CBY4cWfr.js"
	},
	"/assets/useLocation-BbZ7-rZ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-VA4Sip7E8Sx2JvQXRCaSFL1MuUw\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 196,
		"path": "../public/assets/useLocation-BbZ7-rZ_.js"
	},
	"/assets/useRouter-Du1uWnkX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2364-bCM/iINvAAPnaPifvK2VC1r5rfY\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 9060,
		"path": "../public/assets/useRouter-Du1uWnkX.js"
	},
	"/assets/useStore-Dv5OwtUc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4871-V70KtDAkTWa2/D0dix4J4va3oPM\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 18545,
		"path": "../public/assets/useStore-Dv5OwtUc.js"
	},
	"/assets/wishlist-uBIcTsei.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-V3LzhrBePcpxDciKRrEE/AqpbRM\"",
		"mtime": "2026-08-24T11:10:05.126Z",
		"size": 1199,
		"path": "../public/assets/wishlist-uBIcTsei.js"
	},
	"/assets/x-Cjjc6_BH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a2-5wkCAFa+XIdgL6LSnmAw8kp1VM0\"",
		"mtime": "2026-08-24T11:10:05.126Z",
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

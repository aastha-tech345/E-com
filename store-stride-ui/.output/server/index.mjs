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
		"mtime": "2026-08-24T04:38:44.130Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-24T04:38:44.131Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/AdminSidebar-Bup6xc8L.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d5-dJo+P5l4KtodeMbxS7zqAkxfcOY\"",
		"mtime": "2026-08-24T04:38:37.762Z",
		"size": 8405,
		"path": "../public/assets/AdminSidebar-Bup6xc8L.js"
	},
	"/assets/DataTable-Co1S6UeQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f9-MtUB1ComsOFel1hAJWcsC7uTAok\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 5369,
		"path": "../public/assets/DataTable-Co1S6UeQ.js"
	},
	"/assets/EmptyState-BCXHSUhn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-D7/sI+4//M+Jd/O/4BvsRSZi3I4\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 1168,
		"path": "../public/assets/EmptyState-BCXHSUhn.js"
	},
	"/assets/Footer-DYDd2S7m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6db5-EYtftxsBFM+/HRNmePsGdDgCRF0\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 28085,
		"path": "../public/assets/Footer-DYDd2S7m.js"
	},
	"/assets/Price-DbHwFf5G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a6-hYSa6IQaq8cnsVS6EwXfUoxJ3TE\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 678,
		"path": "../public/assets/Price-DbHwFf5G.js"
	},
	"/assets/ProductCard-BrRm1NIx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8a-DDrITMoITjYP624sVT5a+85+Mt8\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 2698,
		"path": "../public/assets/ProductCard-BrRm1NIx.js"
	},
	"/assets/AdminLayout-BBkm1tHJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1775b-/nmXyXvkWccUMYfApMOoISvDDuE\"",
		"mtime": "2026-08-24T04:38:37.762Z",
		"size": 96091,
		"path": "../public/assets/AdminLayout-BBkm1tHJ.js"
	},
	"/assets/QuantitySelector-jKPSWDkl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34d-sYogKOqaLPvihhKQ1rd/cZZf7ww\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 845,
		"path": "../public/assets/QuantitySelector-jKPSWDkl.js"
	},
	"/assets/ShoppingAssistant-DlkwSger.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c17-xy79tAfxjdQL/56rXT3xSzQiIMw\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 7191,
		"path": "../public/assets/ShoppingAssistant-DlkwSger.js"
	},
	"/assets/admin-CUkL1ep9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31d-+qVQ9AFPxDEcFSzKuy7z2AWTybw\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 797,
		"path": "../public/assets/admin-CUkL1ep9.js"
	},
	"/assets/admin.admin-users-D0mp1Hn0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83e-YR4f/JlCedqMM2t/J2BQFopZh/U\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 2110,
		"path": "../public/assets/admin.admin-users-D0mp1Hn0.js"
	},
	"/assets/admin.attributes-C7STkSwu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"334-tEshJHMg2rL74h/JGJ8LRp+1KWg\"",
		"mtime": "2026-08-24T04:38:37.763Z",
		"size": 820,
		"path": "../public/assets/admin.attributes-C7STkSwu.js"
	},
	"/assets/admin.banners-qSRjafzM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-PqrKddiYaxbuIkOGd6AzxQ/nqgo\"",
		"mtime": "2026-08-24T04:38:37.764Z",
		"size": 807,
		"path": "../public/assets/admin.banners-qSRjafzM.js"
	},
	"/assets/admin.brands-Cw0ng4U4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e52-56yZ6/+rlyLlP2T1rgQTU3eFReU\"",
		"mtime": "2026-08-24T04:38:37.764Z",
		"size": 3666,
		"path": "../public/assets/admin.brands-Cw0ng4U4.js"
	},
	"/assets/admin.categories-BbXC9Eon.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e78-/GRAMUjbWZaxSvmKk6hMH+ojIc4\"",
		"mtime": "2026-08-24T04:38:37.764Z",
		"size": 3704,
		"path": "../public/assets/admin.categories-BbXC9Eon.js"
	},
	"/assets/admin.coupons-jNEXx34_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-y9LtabOyG5EF+swa7cpwwFe92Z0\"",
		"mtime": "2026-08-24T04:38:37.764Z",
		"size": 807,
		"path": "../public/assets/admin.coupons-jNEXx34_.js"
	},
	"/assets/admin.customers-DEcJ3pp0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-b922ttv7/CDzoTPHYrQFh8hTXVs\"",
		"mtime": "2026-08-24T04:38:37.764Z",
		"size": 813,
		"path": "../public/assets/admin.customers-DEcJ3pp0.js"
	},
	"/assets/admin.dashboard-DOIoGiZp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65c73-jHIRx/WcXCGw2ot5oLhHsBGgYew\"",
		"mtime": "2026-08-24T04:38:37.764Z",
		"size": 416883,
		"path": "../public/assets/admin.dashboard-DOIoGiZp.js"
	},
	"/assets/admin.index-BZaGgs9G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-7NLUKH3Ur7Oa0JlpD5SD25RaXnU\"",
		"mtime": "2026-08-24T04:38:37.765Z",
		"size": 160,
		"path": "../public/assets/admin.index-BZaGgs9G.js"
	},
	"/assets/admin.inventory-Ca2TfXGe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-EstYcMG2jBZ+TtP1Dmd4aCCEq6o\"",
		"mtime": "2026-08-24T04:38:37.765Z",
		"size": 813,
		"path": "../public/assets/admin.inventory-Ca2TfXGe.js"
	},
	"/assets/admin.login-CtiN-_BH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a5-E5+NemOgGcj6FqFobnwe26dVJbY\"",
		"mtime": "2026-08-24T04:38:37.765Z",
		"size": 2213,
		"path": "../public/assets/admin.login-CtiN-_BH.js"
	},
	"/assets/admin.orders-Ba4RNBCk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-IKNE/iqBYF8yXXA/1b+Z/oOfSoU\"",
		"mtime": "2026-08-24T04:38:37.765Z",
		"size": 807,
		"path": "../public/assets/admin.orders-Ba4RNBCk.js"
	},
	"/assets/admin.product-attributes-C-LApONy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-TAr7eqRxBGFUmoc8NX7O1xRXbCw\"",
		"mtime": "2026-08-24T04:38:37.765Z",
		"size": 1643,
		"path": "../public/assets/admin.product-attributes-C-LApONy.js"
	},
	"/assets/admin.products-DbfB_XTZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108b-E/7pt8N52cifkL+Jpk/BC+WTbi8\"",
		"mtime": "2026-08-24T04:38:37.765Z",
		"size": 4235,
		"path": "../public/assets/admin.products-DbfB_XTZ.js"
	},
	"/assets/admin.products._id.edit-DFo8VpfJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27a2-BnY/Au0ZiWGxAMk4bMw1k2Al4fc\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 10146,
		"path": "../public/assets/admin.products._id.edit-DFo8VpfJ.js"
	},
	"/assets/admin.products.create-ClM5GADI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7e6-LyrFBMigp5b9hnviI/d73qZkLF4\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 42982,
		"path": "../public/assets/admin.products.create-ClM5GADI.js"
	},
	"/assets/admin.products.index-DVHDbZ72.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"872-lTVEF+XRX4/Iuzj9ie88V9vb/zQ\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 2162,
		"path": "../public/assets/admin.products.index-DVHDbZ72.js"
	},
	"/assets/admin.promotions-lEr0WP0X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32f-uvwu2s+NxmFgFTe7ewJVPLDmzb8\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 815,
		"path": "../public/assets/admin.promotions-lEr0WP0X.js"
	},
	"/assets/admin.reviews-Bwl7XRC2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-OTskAVKJWImZkhieaabDeHCDACU\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 807,
		"path": "../public/assets/admin.reviews-Bwl7XRC2.js"
	},
	"/assets/admin.settings-MSL_vzEN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"315-deIXzdFXmfgvr6OOaNKsF7kBgrU\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 789,
		"path": "../public/assets/admin.settings-MSL_vzEN.js"
	},
	"/assets/admin.subcategories-BX78XPmO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-9wlWHWu0MNKIJanUyHUJODROOoI\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 1738,
		"path": "../public/assets/admin.subcategories-BX78XPmO.js"
	},
	"/assets/button-CQmoHenp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ce8-s5At/HUXlf+SzuFn7PEaQ9dd2VU\"",
		"mtime": "2026-08-24T04:38:37.766Z",
		"size": 31976,
		"path": "../public/assets/button-CQmoHenp.js"
	},
	"/assets/cart-BANN6mbk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1590-DcykDKZ6oUfdeTE0cWxuePNaB34\"",
		"mtime": "2026-08-24T04:38:37.767Z",
		"size": 5520,
		"path": "../public/assets/cart-BANN6mbk.js"
	},
	"/assets/category._slug-lw4PMy3p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c33-iBIQN39gmv4uohdR/6T8zHGjLUw\"",
		"mtime": "2026-08-24T04:38:37.767Z",
		"size": 3123,
		"path": "../public/assets/category._slug-lw4PMy3p.js"
	},
	"/assets/checkout-Bgh_2b8K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43fe-M2cOfdKKAiPynXupyfLMCNp/vCI\"",
		"mtime": "2026-08-24T04:38:37.767Z",
		"size": 17406,
		"path": "../public/assets/checkout-Bgh_2b8K.js"
	},
	"/assets/chevron-left-BMxzDcJ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73-l8ppR9nk7e2k6CbZ19vlCqq8eXE\"",
		"mtime": "2026-08-24T04:38:37.767Z",
		"size": 115,
		"path": "../public/assets/chevron-left-BMxzDcJ5.js"
	},
	"/assets/dropdown-menu-CiTrVM4T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"158be-HHB0jaTeY51POhgJecCnwbdJe7k\"",
		"mtime": "2026-08-24T04:38:37.767Z",
		"size": 88254,
		"path": "../public/assets/dropdown-menu-CiTrVM4T.js"
	},
	"/assets/eye-CK5atgdZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-yVknAlI6JMfnjKI4slH5UcOF0s4\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 241,
		"path": "../public/assets/eye-CK5atgdZ.js"
	},
	"/assets/funnel-ksvgxA2c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-H7/V3x2CiQ9k9rj+G9jJEiHgqfQ\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 241,
		"path": "../public/assets/funnel-ksvgxA2c.js"
	},
	"/assets/input-ClR10kK4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-Yy2cHPhijSadIdU8CaCeia4PK5k\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 620,
		"path": "../public/assets/input-ClR10kK4.js"
	},
	"/assets/login-8YUyChQq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f9f-HnbfBPq8pSUea+IpQIDmilV/sjA\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 3999,
		"path": "../public/assets/login-8YUyChQq.js"
	},
	"/assets/index-D16Dxbt9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67e19-0pnw+sXuo8BDxnZqMqRb1Ek5270\"",
		"mtime": "2026-08-24T04:38:37.761Z",
		"size": 425497,
		"path": "../public/assets/index-D16Dxbt9.js"
	},
	"/assets/map-pin-Bpy8IVL0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-wD/6Fd8PiY82QgjRSG5TV0ZldWE\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 244,
		"path": "../public/assets/map-pin-Bpy8IVL0.js"
	},
	"/assets/matchContext-C0chPf5_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-oQtRkEb2uToY6/IphTNmDvEHps4\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 140,
		"path": "../public/assets/matchContext-C0chPf5_.js"
	},
	"/assets/orders._id-BO0Xkdpg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18ff-oV/aJeyuPJboUJkkzeItUMJmP74\"",
		"mtime": "2026-08-24T04:38:37.768Z",
		"size": 6399,
		"path": "../public/assets/orders._id-BO0Xkdpg.js"
	},
	"/assets/orders.index-CHcUwXsd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a6e-f1Zq0CaU2CTfEr8YRJqVHoDRSSI\"",
		"mtime": "2026-08-24T04:38:37.769Z",
		"size": 2670,
		"path": "../public/assets/orders.index-CHcUwXsd.js"
	},
	"/assets/plus-Dvl0yjNN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-jEja5rV3A08lrQDqn5Gz8wn8V+I\"",
		"mtime": "2026-08-24T04:38:37.769Z",
		"size": 138,
		"path": "../public/assets/plus-Dvl0yjNN.js"
	},
	"/assets/products._id-DY-unV37.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2283-3knDksPNSVQRahXX5sxNdRrpRVs\"",
		"mtime": "2026-08-24T04:38:37.769Z",
		"size": 8835,
		"path": "../public/assets/products._id-DY-unV37.js"
	},
	"/assets/register-Gg99jQW2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bce-XY3QKGzh+40hR6D69pInYqXWntE\"",
		"mtime": "2026-08-24T04:38:37.769Z",
		"size": 7118,
		"path": "../public/assets/register-Gg99jQW2.js"
	},
	"/assets/routes-81Kue09F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2448-FFPehEXoDXStpOPENq91rW4sm9w\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 9288,
		"path": "../public/assets/routes-81Kue09F.js"
	},
	"/assets/profile-D2Ai6x07.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f29-tTyLsYJVsKLb5LaUQMgKI7pCzCo\"",
		"mtime": "2026-08-24T04:38:37.769Z",
		"size": 7977,
		"path": "../public/assets/profile-D2Ai6x07.js"
	},
	"/assets/products.index-BfA7AuWA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d53a-yMZ3seArNU1bpa5gtJUeCahYMfQ\"",
		"mtime": "2026-08-24T04:38:37.769Z",
		"size": 54586,
		"path": "../public/assets/products.index-BfA7AuWA.js"
	},
	"/assets/search-D_WGVSfq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d9-FxOSqgsUneFkJPPGFR5lM+X1AbM\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 1497,
		"path": "../public/assets/search-D_WGVSfq.js"
	},
	"/assets/shield-check-BwIWYKp8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-Z680IhOhEGkU78iWvmzL3bSi6S4\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 452,
		"path": "../public/assets/shield-check-BwIWYKp8.js"
	},
	"/assets/square-pen-B2HIJxLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-jw7pZVBb/bjzQqW2XHofMjNxySc\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 305,
		"path": "../public/assets/square-pen-B2HIJxLp.js"
	},
	"/assets/star-BXUED4mL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-/XqPtkCp2TNC5HZ1L9Gd4/RpngE\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 457,
		"path": "../public/assets/star-BXUED4mL.js"
	},
	"/assets/styles-DVleCBUY.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1bced-C4IvGNDPBL22H+S6Dpta+eBOoT8\"",
		"mtime": "2026-08-24T04:38:37.772Z",
		"size": 113901,
		"path": "../public/assets/styles-DVleCBUY.css"
	},
	"/assets/tabs-CQ3GkWuo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da8-0ey3qBqkVPOzP3mmQmoAqrO6bFQ\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 3496,
		"path": "../public/assets/tabs-CQ3GkWuo.js"
	},
	"/assets/trash-2-Du4pR_FV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-ggvnKN/CHH7YlT6cSe/1InzyTZs\"",
		"mtime": "2026-08-24T04:38:37.770Z",
		"size": 313,
		"path": "../public/assets/trash-2-Du4pR_FV.js"
	},
	"/assets/truck-Dm460iCV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"187-woKlZDV6wY9FV/jsfG2BJCyxB5E\"",
		"mtime": "2026-08-24T04:38:37.771Z",
		"size": 391,
		"path": "../public/assets/truck-Dm460iCV.js"
	},
	"/assets/useRouter-Ch6OGJRG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e3-5RzYsxsrJHQH7+ahoc/fMoMgfwE\"",
		"mtime": "2026-08-24T04:38:37.771Z",
		"size": 9187,
		"path": "../public/assets/useRouter-Ch6OGJRG.js"
	},
	"/assets/useStore-CRTcEvnu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4871-rAzNpEH44b8ZVyPU8OoZlJqu7tI\"",
		"mtime": "2026-08-24T04:38:37.771Z",
		"size": 18545,
		"path": "../public/assets/useStore-CRTcEvnu.js"
	},
	"/assets/wishlist-Bb8p6tFP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-vrBepf8aqK1m21hVwX2OI7RSbeo\"",
		"mtime": "2026-08-24T04:38:37.771Z",
		"size": 1199,
		"path": "../public/assets/wishlist-Bb8p6tFP.js"
	},
	"/assets/x-DJoAIeNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a2-uIFHT/vHSZFxkiLQF6LsIznmeNQ\"",
		"mtime": "2026-08-24T04:38:37.771Z",
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
var _lazy_rtj1IO = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_rtj1IO
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

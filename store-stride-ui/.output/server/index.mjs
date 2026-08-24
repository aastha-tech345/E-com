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
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-24T05:29:07.238Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/AdminLayout-CiPP1NZa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23b3-JX0Ljuw5hfCqTWm0ujcEn2SrI/g\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 9139,
		"path": "../public/assets/AdminLayout-CiPP1NZa.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-24T05:29:07.238Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/AdminSidebar-B_LJSgZ1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d5-ZFUfS28/fBe0GoqvgOsrJJAr1WU\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 8405,
		"path": "../public/assets/AdminSidebar-B_LJSgZ1.js"
	},
	"/assets/DataTable-BALDmMyB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f9-6WJMmfIFJlCNqHPioG0ighEM2Ks\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 5369,
		"path": "../public/assets/DataTable-BALDmMyB.js"
	},
	"/assets/EmptyState-BCXHSUhn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"490-D7/sI+4//M+Jd/O/4BvsRSZi3I4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1168,
		"path": "../public/assets/EmptyState-BCXHSUhn.js"
	},
	"/assets/Footer-CXvZbqv8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f11-L3N3C6fO9dUc8jCq4XdL6xuay1s\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 28433,
		"path": "../public/assets/Footer-CXvZbqv8.js"
	},
	"/assets/Price-A99s4_Jq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a6-9oPdpJWCMcy41rBpjRVgjwWLRD8\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 678,
		"path": "../public/assets/Price-A99s4_Jq.js"
	},
	"/assets/ProductCard-BhFiDXJc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9fa-fJD8vxVz6s+jYq0xlOUbheM4hyk\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 2554,
		"path": "../public/assets/ProductCard-BhFiDXJc.js"
	},
	"/assets/ShoppingAssistant-VDsRQAbT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"230d-rRQC+WGOk5o+nJEDqxFbvBue1uQ\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 8973,
		"path": "../public/assets/ShoppingAssistant-VDsRQAbT.js"
	},
	"/assets/admin-Ck7JcgzI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"339-dewr9rYMowsgpFvHmQPBo255jss\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 825,
		"path": "../public/assets/admin-Ck7JcgzI.js"
	},
	"/assets/admin.admin-users-BNE7BhGx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"83e-nOQrKImHjWpz/Mn6gRI8V+MaAuU\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 2110,
		"path": "../public/assets/admin.admin-users-BNE7BhGx.js"
	},
	"/assets/admin.attributes-CGmHpybv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"334-ZmRE61JUudyLVnCLHw0SOIcsKYg\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 820,
		"path": "../public/assets/admin.attributes-CGmHpybv.js"
	},
	"/assets/admin.banners-9kZhHfEn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-gCyDHNxwpdltOuLfkWTr4YJ8Bg4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 807,
		"path": "../public/assets/admin.banners-9kZhHfEn.js"
	},
	"/assets/admin.brands-54SNoNh1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e4d-kELJBAoFkc6kYaRUu99SQw/zyv4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 3661,
		"path": "../public/assets/admin.brands-54SNoNh1.js"
	},
	"/assets/admin.categories-BusBqaT0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e73-ddAIS93bTe7PtW6XhI0Kuv+kFh4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 3699,
		"path": "../public/assets/admin.categories-BusBqaT0.js"
	},
	"/assets/admin.coupons-B_9KCk89.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-yDAgHJjgbmBxL+EJdB6ATfNM+XA\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 807,
		"path": "../public/assets/admin.coupons-B_9KCk89.js"
	},
	"/assets/admin.customers-azrSvSuY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-71e3pVzfOS/LyD62QiJNQlpQkFM\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 813,
		"path": "../public/assets/admin.customers-azrSvSuY.js"
	},
	"/assets/admin.index-CZJKl1qb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a0-dJcXS9VuOjWC++dXlXGAQhPIBB8\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 160,
		"path": "../public/assets/admin.index-CZJKl1qb.js"
	},
	"/assets/admin.inventory-CNLHc2eG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32d-oTQUTfVZOHEVwos5obMezJU2/Mg\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 813,
		"path": "../public/assets/admin.inventory-CNLHc2eG.js"
	},
	"/assets/admin.login-DSxYr5WP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a0-qD/c0n8teeB8Yo4IZU1iS3pBtqs\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 2208,
		"path": "../public/assets/admin.login-DSxYr5WP.js"
	},
	"/assets/admin.orders-DWgs97zn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-TLHOEXlLe6jlB5LYZkc31iLLl9k\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 807,
		"path": "../public/assets/admin.orders-DWgs97zn.js"
	},
	"/assets/admin.product-attributes-BmyELbiZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"66b-Ahys9TnInDz1tnfw/9AdETWiYJM\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1643,
		"path": "../public/assets/admin.product-attributes-BmyELbiZ.js"
	},
	"/assets/admin.products-BmZIJ8Pk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108b-3GnA6ySFa4fyvE3CHDRnN9hbWB8\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 4235,
		"path": "../public/assets/admin.products-BmZIJ8Pk.js"
	},
	"/assets/admin.dashboard-BdbP1qVQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"65c72-wu4JJRlrse4YqQXe1vKUXbZtGnk\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 416882,
		"path": "../public/assets/admin.dashboard-BdbP1qVQ.js"
	},
	"/assets/admin.products._id.edit-BJcaRjqb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27a2-3uv65HdPYNC41hUtzfvbeUZe+fM\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 10146,
		"path": "../public/assets/admin.products._id.edit-BJcaRjqb.js"
	},
	"/assets/admin.products.create-C0V7977r.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7eb-9hEeH0DAgRkUkyk/HwJdOgU8yB8\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 42987,
		"path": "../public/assets/admin.products.create-C0V7977r.js"
	},
	"/assets/admin.products.index-Cmk_pCq2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"872-hP9+6HgaZ3xwS7ivUqnYdrEnGN8\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 2162,
		"path": "../public/assets/admin.products.index-Cmk_pCq2.js"
	},
	"/assets/admin.promotions-CajZ-_LW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"32f-BlfLXaISEV2bMdGMUS8nuoL0Vtg\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 815,
		"path": "../public/assets/admin.promotions-CajZ-_LW.js"
	},
	"/assets/admin.reviews-CoUOXsQg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"327-C6FYLriq3rTsaBfyvfW4Qqz2KXA\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 807,
		"path": "../public/assets/admin.reviews-CoUOXsQg.js"
	},
	"/assets/admin.settings-CtksArK6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"315-3vvTdzmoO2lK0XuyBwI89KZyrCM\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 789,
		"path": "../public/assets/admin.settings-CtksArK6.js"
	},
	"/assets/admin.subcategories-DiRqkFmd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ca-3mvsh6cUVg9Tc0JB1GE9IeYmdNg\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1738,
		"path": "../public/assets/admin.subcategories-DiRqkFmd.js"
	},
	"/assets/button-CQmoHenp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ce8-s5At/HUXlf+SzuFn7PEaQ9dd2VU\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 31976,
		"path": "../public/assets/button-CQmoHenp.js"
	},
	"/assets/cart-Bc_eFiJ4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14dc-5KiqDmC+h/2XsdveWciTQT/aCfM\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 5340,
		"path": "../public/assets/cart-Bc_eFiJ4.js"
	},
	"/assets/category._slug-DpUMbnY3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c38-2oZM+BqasfjQCr+lEMQzNSundVE\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 3128,
		"path": "../public/assets/category._slug-DpUMbnY3.js"
	},
	"/assets/checkout-CPAVy0ZE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4550-rzhE8QkrJF3eOWY6iC2Bsz/mDjo\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 17744,
		"path": "../public/assets/checkout-CPAVy0ZE.js"
	},
	"/assets/checkout.cancel-DOH2bi3R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e1-myNB8IZT8bAZexASSMdigwA4TqU\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1249,
		"path": "../public/assets/checkout.cancel-DOH2bi3R.js"
	},
	"/assets/checkout.success-CD2PHkEI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ff-rbZd44emGzYa1QstXsghv/ryjao\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1279,
		"path": "../public/assets/checkout.success-CD2PHkEI.js"
	},
	"/assets/chevron-left-BMxzDcJ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"73-l8ppR9nk7e2k6CbZ19vlCqq8eXE\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 115,
		"path": "../public/assets/chevron-left-BMxzDcJ5.js"
	},
	"/assets/circle-check-big-0whPkehT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b3-7WnCDzOfduRl3LB9fui2Vdo4dVc\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 179,
		"path": "../public/assets/circle-check-big-0whPkehT.js"
	},
	"/assets/eye-CK5atgdZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-yVknAlI6JMfnjKI4slH5UcOF0s4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 241,
		"path": "../public/assets/eye-CK5atgdZ.js"
	},
	"/assets/dropdown-menu-CBv6dxRa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"158be-YhDgqSI3NhUv9TEbXfDyY/RNUYg\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 88254,
		"path": "../public/assets/dropdown-menu-CBv6dxRa.js"
	},
	"/assets/funnel-ksvgxA2c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f1-H7/V3x2CiQ9k9rj+G9jJEiHgqfQ\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 241,
		"path": "../public/assets/funnel-ksvgxA2c.js"
	},
	"/assets/input-ClR10kK4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26c-Yy2cHPhijSadIdU8CaCeia4PK5k\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 620,
		"path": "../public/assets/input-ClR10kK4.js"
	},
	"/assets/login-DjCgTxTu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa4-rrOoh39YFVmSn0JpSnlfGyvMZY4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 4004,
		"path": "../public/assets/login-DjCgTxTu.js"
	},
	"/assets/map-pin-Bpy8IVL0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f4-wD/6Fd8PiY82QgjRSG5TV0ZldWE\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 244,
		"path": "../public/assets/map-pin-Bpy8IVL0.js"
	},
	"/assets/matchContext-C0chPf5_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8c-oQtRkEb2uToY6/IphTNmDvEHps4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 140,
		"path": "../public/assets/matchContext-C0chPf5_.js"
	},
	"/assets/orders._id-SLwuQGSU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c00-wcST5nGFxznkza7aSkrz2CbcH4c\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 7168,
		"path": "../public/assets/orders._id-SLwuQGSU.js"
	},
	"/assets/orders.index-CPksX4Wo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8f-LXI0F9lGDEtHGYg5kkNsqi/jS5U\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 3215,
		"path": "../public/assets/orders.index-CPksX4Wo.js"
	},
	"/assets/index-BngxBZU7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"689bd-KfikSB0dlMM1kkzqeloFfH4dgbY\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 428477,
		"path": "../public/assets/index-BngxBZU7.js"
	},
	"/assets/plus-Dvl0yjNN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a-jEja5rV3A08lrQDqn5Gz8wn8V+I\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 138,
		"path": "../public/assets/plus-Dvl0yjNN.js"
	},
	"/assets/products._id-BsedxMxh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2601-NXsZKTj2tyX93Cbgu+KfFU5UkLM\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 9729,
		"path": "../public/assets/products._id-BsedxMxh.js"
	},
	"/assets/products.index-D5xxL0OH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d2f8-Cc1gA3/aMNEYgMmegQQGNicjg2E\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 54008,
		"path": "../public/assets/products.index-D5xxL0OH.js"
	},
	"/assets/profile-Df3c4258.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f29-9nw/GeRn1reLNJipGkoL+w0lWnI\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 7977,
		"path": "../public/assets/profile-Df3c4258.js"
	},
	"/assets/register-BM9fIz6c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bff-FnKyEgMuE65Bi9kVfmbA5R5IYSU\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 7167,
		"path": "../public/assets/register-BM9fIz6c.js"
	},
	"/assets/rotate-ccw-8cR0B35d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b9-F//TUaWfzDDGkzsJKQmzMdi1Ecw\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 185,
		"path": "../public/assets/rotate-ccw-8cR0B35d.js"
	},
	"/assets/routes-ZqZh0zxW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1970-KD2PhnVoHswXG5nbjFmEGIFTTT0\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 6512,
		"path": "../public/assets/routes-ZqZh0zxW.js"
	},
	"/assets/search-CVQ2lnh5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d9-OUIMH1aXuwXhJWcv34/3sm2v9q4\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1497,
		"path": "../public/assets/search-CVQ2lnh5.js"
	},
	"/assets/square-pen-B2HIJxLp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"131-jw7pZVBb/bjzQqW2XHofMjNxySc\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 305,
		"path": "../public/assets/square-pen-B2HIJxLp.js"
	},
	"/assets/star-BXUED4mL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-/XqPtkCp2TNC5HZ1L9Gd4/RpngE\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 457,
		"path": "../public/assets/star-BXUED4mL.js"
	},
	"/assets/tabs-CYowpZkD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da8-Ny3r3IMkIHpR9i7K5P6T9regtv0\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 3496,
		"path": "../public/assets/tabs-CYowpZkD.js"
	},
	"/assets/styles-Dib6ZpwN.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1a875-MXqaVCebhRHhj5m9cmfYHOYAxNg\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 108661,
		"path": "../public/assets/styles-Dib6ZpwN.css"
	},
	"/assets/trash-2-Du4pR_FV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"139-ggvnKN/CHH7YlT6cSe/1InzyTZs\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 313,
		"path": "../public/assets/trash-2-Du4pR_FV.js"
	},
	"/assets/truck-Dm460iCV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"187-woKlZDV6wY9FV/jsfG2BJCyxB5E\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 391,
		"path": "../public/assets/truck-Dm460iCV.js"
	},
	"/assets/useRouter-Ch6OGJRG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23e3-5RzYsxsrJHQH7+ahoc/fMoMgfwE\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 9187,
		"path": "../public/assets/useRouter-Ch6OGJRG.js"
	},
	"/assets/useStore-CRTcEvnu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4871-rAzNpEH44b8ZVyPU8OoZlJqu7tI\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 18545,
		"path": "../public/assets/useStore-CRTcEvnu.js"
	},
	"/assets/wishlist-BzrBaka-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4af-wz3HLTTgJ6S8jkODo7ad1NGqTe0\"",
		"mtime": "2026-08-24T05:29:06.009Z",
		"size": 1199,
		"path": "../public/assets/wishlist-BzrBaka-.js"
	},
	"/assets/x-DJoAIeNK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8a2-uIFHT/vHSZFxkiLQF6LsIznmeNQ\"",
		"mtime": "2026-08-24T05:29:06.009Z",
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

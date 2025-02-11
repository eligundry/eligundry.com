;(() => {
  var t,
    n,
    e,
    i = Object.create,
    r = Object.defineProperty,
    o = Object.getOwnPropertyDescriptor,
    s = Object.getOwnPropertyNames,
    l = Object.getPrototypeOf,
    u = Object.prototype.hasOwnProperty,
    a = (t) => r(t, '__esModule', { value: !0 }),
    h = (t, n) => () => (n || t((n = { exports: {} }).exports, n), n.exports),
    c = (t, n, e) => {
      if ((n && 'object' == typeof n) || 'function' == typeof n)
        for (let i of s(n))
          u.call(t, i) ||
            'default' === i ||
            r(t, i, {
              get: () => n[i],
              enumerable: !(e = o(n, i)) || e.enumerable,
            })
      return t
    },
    f = (t) =>
      c(
        a(
          r(
            null != t ? i(l(t)) : {},
            'default',
            t && t.__esModule && 'default' in t
              ? { get: () => t.default, enumerable: !0 }
              : { value: t, enumerable: !0 }
          )
        ),
        t
      ),
    _ = h((t, n) => {
      !(function (t, n, e) {
        function i(t) {
          var n,
            e = this,
            i =
              ((n = 4022871197),
              function (t) {
                t = String(t)
                for (var e = 0; e < t.length; e++) {
                  var i = 0.02519603282416938 * (n += t.charCodeAt(e))
                  ;(n = i >>> 0),
                    (i -= n),
                    (i *= n),
                    (n = i >>> 0),
                    (i -= n),
                    (n += 4294967296 * i)
                }
                return (n >>> 0) * 23283064365386963e-26
              })
          ;(e.next = function () {
            var t = 2091639 * e.s0 + 23283064365386963e-26 * e.c
            return (e.s0 = e.s1), (e.s1 = e.s2), (e.s2 = t - (e.c = 0 | t))
          }),
            (e.c = 1),
            (e.s0 = i(' ')),
            (e.s1 = i(' ')),
            (e.s2 = i(' ')),
            (e.s0 -= i(t)),
            e.s0 < 0 && (e.s0 += 1),
            (e.s1 -= i(t)),
            e.s1 < 0 && (e.s1 += 1),
            (e.s2 -= i(t)),
            e.s2 < 0 && (e.s2 += 1),
            (i = null)
        }
        function r(t, n) {
          return (n.c = t.c), (n.s0 = t.s0), (n.s1 = t.s1), (n.s2 = t.s2), n
        }
        function o(t, n) {
          var e = new i(t),
            o = n && n.state,
            s = e.next
          return (
            (s.int32 = function () {
              return (4294967296 * e.next()) | 0
            }),
            (s.double = function () {
              return s() + ((2097152 * s()) | 0) * 11102230246251565e-32
            }),
            (s.quick = s),
            o &&
              ('object' == typeof o && r(o, e),
              (s.state = function () {
                return r(e, {})
              })),
            s
          )
        }
        n && n.exports
          ? (n.exports = o)
          : e && e.amd
            ? e(function () {
                return o
              })
            : (this.alea = o)
      })(t, 'object' == typeof n && n, 'function' == typeof define && define)
    }),
    $ = h((t, n) => {
      !(function (t, n, e) {
        function i(t) {
          var n = this,
            e = ''
          ;(n.x = 0),
            (n.y = 0),
            (n.z = 0),
            (n.w = 0),
            (n.next = function () {
              var t = n.x ^ (n.x << 11)
              return (
                (n.x = n.y),
                (n.y = n.z),
                (n.z = n.w),
                (n.w ^= (n.w >>> 19) ^ t ^ (t >>> 8))
              )
            }),
            t === (0 | t) ? (n.x = t) : (e += t)
          for (var i = 0; i < e.length + 64; i++)
            (n.x ^= 0 | e.charCodeAt(i)), n.next()
        }
        function r(t, n) {
          return (n.x = t.x), (n.y = t.y), (n.z = t.z), (n.w = t.w), n
        }
        function o(t, n) {
          var e = new i(t),
            o = n && n.state,
            s = function () {
              return (e.next() >>> 0) / 4294967296
            }
          return (
            (s.double = function () {
              do
                var t = e.next() >>> 11,
                  n = (e.next() >>> 0) / 4294967296,
                  i = (t + n) / 2097152
              while (0 === i)
              return i
            }),
            (s.int32 = e.next),
            (s.quick = s),
            o &&
              ('object' == typeof o && r(o, e),
              (s.state = function () {
                return r(e, {})
              })),
            s
          )
        }
        n && n.exports
          ? (n.exports = o)
          : e && e.amd
            ? e(function () {
                return o
              })
            : (this.xor128 = o)
      })(t, 'object' == typeof n && n, 'function' == typeof define && define)
    }),
    p = h((t, n) => {
      !(function (t, n, e) {
        function i(t) {
          var n = this,
            e = ''
          ;(n.next = function () {
            var t = n.x ^ (n.x >>> 2)
            return (
              (n.x = n.y),
              (n.y = n.z),
              (n.z = n.w),
              (n.w = n.v),
              ((n.d = (n.d + 362437) | 0) +
                (n.v = n.v ^ (n.v << 4) ^ (t ^ (t << 1)))) |
                0
            )
          }),
            (n.x = 0),
            (n.y = 0),
            (n.z = 0),
            (n.w = 0),
            (n.v = 0),
            t === (0 | t) ? (n.x = t) : (e += t)
          for (var i = 0; i < e.length + 64; i++)
            (n.x ^= 0 | e.charCodeAt(i)),
              i == e.length && (n.d = (n.x << 10) ^ (n.x >>> 4)),
              n.next()
        }
        function r(t, n) {
          return (
            (n.x = t.x),
            (n.y = t.y),
            (n.z = t.z),
            (n.w = t.w),
            (n.v = t.v),
            (n.d = t.d),
            n
          )
        }
        function o(t, n) {
          var e = new i(t),
            o = n && n.state,
            s = function () {
              return (e.next() >>> 0) / 4294967296
            }
          return (
            (s.double = function () {
              do
                var t = e.next() >>> 11,
                  n = (e.next() >>> 0) / 4294967296,
                  i = (t + n) / 2097152
              while (0 === i)
              return i
            }),
            (s.int32 = e.next),
            (s.quick = s),
            o &&
              ('object' == typeof o && r(o, e),
              (s.state = function () {
                return r(e, {})
              })),
            s
          )
        }
        n && n.exports
          ? (n.exports = o)
          : e && e.amd
            ? e(function () {
                return o
              })
            : (this.xorwow = o)
      })(t, 'object' == typeof n && n, 'function' == typeof define && define)
    }),
    d = h((t, n) => {
      !(function (t, n, e) {
        function i(t) {
          var n = this
          ;(n.next = function () {
            var t,
              e,
              i = n.x,
              r = n.i
            return (
              (t = i[r]),
              (t ^= t >>> 7),
              (e = t ^ (t << 24)),
              (e ^= (t = i[(r + 1) & 7]) ^ (t >>> 10)),
              (e ^= (t = i[(r + 3) & 7]) ^ (t >>> 3)),
              (e ^= (t = i[(r + 4) & 7]) ^ (t << 7)),
              (t = i[(r + 7) & 7]),
              (t ^= t << 13),
              (e ^= t ^ (t << 9)),
              (i[r] = e),
              (n.i = (r + 1) & 7),
              e
            )
          }),
            !(function t(n, e) {
              var i,
                r,
                o = []
              if (e === (0 | e)) r = o[0] = e
              else
                for (e = '' + e, i = 0; i < e.length; ++i)
                  o[7 & i] =
                    (o[7 & i] << 15) ^
                    ((e.charCodeAt(i) + o[(i + 1) & 7]) << 13)
              for (; o.length < 8; ) o.push(0)
              for (i = 0; i < 8 && 0 === o[i]; ++i);
              for (
                r = 8 == i ? (o[7] = -1) : o[i], n.x = o, n.i = 0, i = 256;
                i > 0;
                --i
              )
                n.next()
            })(n, t)
        }
        function r(t, n) {
          return (n.x = t.x.slice()), (n.i = t.i), n
        }
        function o(t, n) {
          null == t && (t = +new Date())
          var e = new i(t),
            o = n && n.state,
            s = function () {
              return (e.next() >>> 0) / 4294967296
            }
          return (
            (s.double = function () {
              do
                var t = e.next() >>> 11,
                  n = (e.next() >>> 0) / 4294967296,
                  i = (t + n) / 2097152
              while (0 === i)
              return i
            }),
            (s.int32 = e.next),
            (s.quick = s),
            o &&
              (o.x && r(o, e),
              (s.state = function () {
                return r(e, {})
              })),
            s
          )
        }
        n && n.exports
          ? (n.exports = o)
          : e && e.amd
            ? e(function () {
                return o
              })
            : (this.xorshift7 = o)
      })(t, 'object' == typeof n && n, 'function' == typeof define && define)
    }),
    g = h((t, n) => {
      !(function (t, n, e) {
        function i(t) {
          var n = this
          ;(n.next = function () {
            var t,
              e,
              i = n.w,
              r = n.X,
              o = n.i
            return (
              (n.w = i = (i + 1640531527) | 0),
              (e = r[(o + 34) & 127]),
              (t = r[(o = (o + 1) & 127)]),
              (e ^= e << 13),
              (t ^= t << 17),
              (e ^= e >>> 15),
              (t ^= t >>> 12),
              (e = r[o] = e ^ t),
              (n.i = o),
              (e + (i ^ (i >>> 16))) | 0
            )
          }),
            !(function t(n, e) {
              var i,
                r,
                o,
                s,
                l,
                u = [],
                a = 128
              for (
                e === (0 | e)
                  ? ((r = e), (e = null))
                  : ((e += '\0'), (r = 0), (a = Math.max(a, e.length))),
                  o = 0,
                  s = -32;
                s < a;
                ++s
              )
                e && (r ^= e.charCodeAt((s + 32) % e.length)),
                  0 === s && (l = r),
                  (r ^= r << 10),
                  (r ^= r >>> 15),
                  (r ^= r << 4),
                  (r ^= r >>> 13),
                  s >= 0 &&
                    ((l = (l + 1640531527) | 0),
                    (o = 0 == (i = u[127 & s] ^= r + l) ? o + 1 : 0))
              for (
                o >= 128 && (u[127 & ((e && e.length) || 0)] = -1),
                  o = 127,
                  s = 512;
                s > 0;
                --s
              )
                (r = u[(o + 34) & 127]),
                  (i = u[(o = (o + 1) & 127)]),
                  (r ^= r << 13),
                  (i ^= i << 17),
                  (r ^= r >>> 15),
                  (i ^= i >>> 12),
                  (u[o] = r ^ i)
              ;(n.w = l), (n.X = u), (n.i = o)
            })(n, t)
        }
        function r(t, n) {
          return (n.i = t.i), (n.w = t.w), (n.X = t.X.slice()), n
        }
        function o(t, n) {
          null == t && (t = +new Date())
          var e = new i(t),
            o = n && n.state,
            s = function () {
              return (e.next() >>> 0) / 4294967296
            }
          return (
            (s.double = function () {
              do
                var t = e.next() >>> 11,
                  n = (e.next() >>> 0) / 4294967296,
                  i = (t + n) / 2097152
              while (0 === i)
              return i
            }),
            (s.int32 = e.next),
            (s.quick = s),
            o &&
              (o.X && r(o, e),
              (s.state = function () {
                return r(e, {})
              })),
            s
          )
        }
        n && n.exports
          ? (n.exports = o)
          : e && e.amd
            ? e(function () {
                return o
              })
            : (this.xor4096 = o)
      })(t, 'object' == typeof n && n, 'function' == typeof define && define)
    }),
    v = h((t, n) => {
      !(function (t, n, e) {
        function i(t) {
          var n = this,
            e = ''
          ;(n.next = function () {
            var t = n.b,
              e = n.c,
              i = n.d,
              r = n.a
            return (
              (t = (t << 25) ^ (t >>> 7) ^ e),
              (e = (e - i) | 0),
              (i = (i << 24) ^ (i >>> 8) ^ r),
              (r = (r - t) | 0),
              (n.b = t = (t << 20) ^ (t >>> 12) ^ e),
              (n.c = e = (e - i) | 0),
              (n.d = (i << 16) ^ (e >>> 16) ^ r),
              (n.a = (r - t) | 0)
            )
          }),
            (n.a = 0),
            (n.b = 0),
            (n.c = -1640531527),
            (n.d = 1367130551),
            t === Math.floor(t)
              ? ((n.a = (t / 4294967296) | 0), (n.b = 0 | t))
              : (e += t)
          for (var i = 0; i < e.length + 20; i++)
            (n.b ^= 0 | e.charCodeAt(i)), n.next()
        }
        function r(t, n) {
          return (n.a = t.a), (n.b = t.b), (n.c = t.c), (n.d = t.d), n
        }
        function o(t, n) {
          var e = new i(t),
            o = n && n.state,
            s = function () {
              return (e.next() >>> 0) / 4294967296
            }
          return (
            (s.double = function () {
              do
                var t = e.next() >>> 11,
                  n = (e.next() >>> 0) / 4294967296,
                  i = (t + n) / 2097152
              while (0 === i)
              return i
            }),
            (s.int32 = e.next),
            (s.quick = s),
            o &&
              ('object' == typeof o && r(o, e),
              (s.state = function () {
                return r(e, {})
              })),
            s
          )
        }
        n && n.exports
          ? (n.exports = o)
          : e && e.amd
            ? e(function () {
                return o
              })
            : (this.tychei = o)
      })(t, 'object' == typeof n && n, 'function' == typeof define && define)
    }),
    y = h(() => {}),
    m = h((t, n) => {
      !(function (t, e, i) {
        var r,
          o = 6,
          s = 'random',
          l = i.pow(256, o),
          u = i.pow(2, 52),
          a = 2 * u
        function h(n, h, p) {
          var d = [],
            g = _(
              (function t(n, e) {
                var i,
                  r = [],
                  o = typeof n
                if (e && 'object' == o)
                  for (i in n)
                    try {
                      r.push(t(n[i], e - 1))
                    } catch (s) {}
                return r.length ? r : 'string' == o ? n : n + '\0'
              })(
                (h = !0 == h ? { entropy: !0 } : h || {}).entropy
                  ? [n, $(e)]
                  : (n ??
                      (function n() {
                        try {
                          var i
                          return (
                            r && (i = r.randomBytes)
                              ? (i = i(256))
                              : ((i = new Uint8Array(256)),
                                (t.crypto || t.msCrypto).getRandomValues(i)),
                            $(i)
                          )
                        } catch (o) {
                          var s = t.navigator,
                            l = s && s.plugins
                          return [+new Date(), t, l, t.screen, $(e)]
                        }
                      })()),
                3
              ),
              d
            ),
            v = new c(d),
            y = function () {
              for (var t = v.g(o), n = l, e = 0; t < u; )
                (t = (t + e) * 256), (n *= 256), (e = v.g(1))
              for (; t >= a; ) (t /= 2), (n /= 2), (e >>>= 1)
              return (t + e) / n
            }
          return (
            (y.int32 = function () {
              return 0 | v.g(4)
            }),
            (y.quick = function () {
              return v.g(4) / 4294967296
            }),
            (y.double = y),
            _($(v.S), e),
            (
              h.pass ||
              p ||
              function (t, n, e, r) {
                return (
                  r &&
                    (r.S && f(r, v),
                    (t.state = function () {
                      return f(v, {})
                    })),
                  e ? ((i[s] = t), n) : t
                )
              }
            )(y, g, 'global' in h ? h.global : this == i, h.state)
          )
        }
        function c(t) {
          var n,
            e = t.length,
            i = this,
            r = 0,
            o = (i.i = i.j = 0),
            s = (i.S = [])
          for (e || (t = [e++]); r < 256; ) s[r] = r++
          for (r = 0; r < 256; r++)
            (s[r] = s[(o = 255 & (o + t[r % e] + (n = s[r])))]), (s[o] = n)
          ;(i.g = function (t) {
            for (var n, e = 0, r = i.i, o = i.j, s = i.S; t--; )
              (n = s[(r = 255 & (r + 1))]),
                (e =
                  256 * e +
                  s[255 & ((s[r] = s[(o = 255 & (o + n))]) + (s[o] = n))])
            return (i.i = r), (i.j = o), e
          })(256)
        }
        function f(t, n) {
          return (n.i = t.i), (n.j = t.j), (n.S = t.S.slice()), n
        }
        function _(t, n) {
          for (var e, i = t + '', r = 0; r < i.length; )
            n[255 & r] = 255 & ((e ^= 19 * n[255 & r]) + i.charCodeAt(r++))
          return $(n)
        }
        function $(t) {
          return String.fromCharCode.apply(0, t)
        }
        if ((_(i.random(), e), 'object' == typeof n && n.exports)) {
          n.exports = h
          try {
            r = y()
          } catch (p) {}
        } else
          'function' == typeof define && define.amd
            ? define(function () {
                return h
              })
            : (i['seed' + s] = h)
      })('undefined' != typeof self ? self : t, [], Math)
    }),
    x = h((t, n) => {
      var e = _(),
        i = $(),
        r = p(),
        o = d(),
        s = g(),
        l = v(),
        u = m()
      ;(u.alea = e),
        (u.xor128 = i),
        (u.xorwow = r),
        (u.xorshift7 = o),
        (u.xor4096 = s),
        (u.tychei = l),
        (n.exports = u)
    }),
    w = h((t, n) => {
      !(function () {
        function t(t, n, e, i) {
          ;(this.max_objects = n || 10),
            (this.max_levels = e || 4),
            (this.level = i || 0),
            (this.bounds = t),
            (this.objects = []),
            (this.nodes = [])
        }
        ;(t.prototype.split = function () {
          var n = this.level + 1,
            e = this.bounds.width / 2,
            i = this.bounds.height / 2,
            r = this.bounds.x,
            o = this.bounds.y
          ;(this.nodes[0] = new t(
            { x: r + e, y: o, width: e, height: i },
            this.max_objects,
            this.max_levels,
            n
          )),
            (this.nodes[1] = new t(
              { x: r, y: o, width: e, height: i },
              this.max_objects,
              this.max_levels,
              n
            )),
            (this.nodes[2] = new t(
              { x: r, y: o + i, width: e, height: i },
              this.max_objects,
              this.max_levels,
              n
            )),
            (this.nodes[3] = new t(
              { x: r + e, y: o + i, width: e, height: i },
              this.max_objects,
              this.max_levels,
              n
            ))
        }),
          (t.prototype.getIndex = function (t) {
            var n = [],
              e = this.bounds.x + this.bounds.width / 2,
              i = this.bounds.y + this.bounds.height / 2,
              r = t.y < i,
              o = t.x < e,
              s = t.x + t.width > e,
              l = t.y + t.height > i
            return (
              r && s && n.push(0),
              o && r && n.push(1),
              o && l && n.push(2),
              s && l && n.push(3),
              n
            )
          }),
          (t.prototype.insert = function (t) {
            var n,
              e = 0
            if (this.nodes.length) {
              for (n = this.getIndex(t), e = 0; e < n.length; e++)
                this.nodes[n[e]].insert(t)
              return
            }
            if (
              (this.objects.push(t),
              this.objects.length > this.max_objects &&
                this.level < this.max_levels)
            ) {
              for (
                this.nodes.length || this.split(), e = 0;
                e < this.objects.length;
                e++
              ) {
                n = this.getIndex(this.objects[e])
                for (var i = 0; i < n.length; i++)
                  this.nodes[n[i]].insert(this.objects[e])
              }
              this.objects = []
            }
          }),
          (t.prototype.retrieve = function (t) {
            var n = this.getIndex(t),
              e = this.objects
            if (this.nodes.length)
              for (var i = 0; i < n.length; i++)
                e = e.concat(this.nodes[n[i]].retrieve(t))
            return (e = e.filter(function (t, n) {
              return e.indexOf(t) >= n
            }))
          }),
          (t.prototype.clear = function () {
            this.objects = []
            for (var t = 0; t < this.nodes.length; t++)
              this.nodes.length && this.nodes[t].clear()
            this.nodes = []
          }),
          void 0 !== n && void 0 !== n.exports
            ? (n.exports = t)
            : (window.Quadtree = t)
      })()
    }),
    b = h((t, n) => {
      !(function () {
        'use strict'
        var e = 0.5 * (Math.sqrt(3) - 1),
          i = (3 - Math.sqrt(3)) / 6,
          r = 1 / 3,
          o = 1 / 6,
          s = (Math.sqrt(5) - 1) / 4,
          l = (5 - Math.sqrt(5)) / 20
        function u(t) {
          var n
          ;(n =
            'function' == typeof t
              ? t
              : t
                ? (function t() {
                    var n,
                      e = 0,
                      i = 0,
                      r = 0,
                      o = 1,
                      s =
                        ((n = 4022871197),
                        function (t) {
                          t = t.toString()
                          for (var e = 0; e < t.length; e++) {
                            var i = 0.02519603282416938 * (n += t.charCodeAt(e))
                            ;(n = i >>> 0),
                              (i -= n),
                              (i *= n),
                              (n = i >>> 0),
                              (i -= n),
                              (n += 4294967296 * i)
                          }
                          return (n >>> 0) * 23283064365386963e-26
                        })
                    ;(e = s(' ')), (i = s(' ')), (r = s(' '))
                    for (var l = 0; l < arguments.length; l++)
                      (e -= s(arguments[l])),
                        e < 0 && (e += 1),
                        (i -= s(arguments[l])),
                        i < 0 && (i += 1),
                        (r -= s(arguments[l])),
                        r < 0 && (r += 1)
                    return (
                      (s = null),
                      function () {
                        var t = 2091639 * e + 23283064365386963e-26 * o
                        return (e = i), (i = r), (r = t - (o = 0 | t))
                      }
                    )
                  })(t)
                : Math.random),
            (this.p = a(n)),
            (this.perm = new Uint8Array(512)),
            (this.permMod12 = new Uint8Array(512))
          for (var e = 0; e < 512; e++)
            (this.perm[e] = this.p[255 & e]),
              (this.permMod12[e] = this.perm[e] % 12)
        }
        function a(t) {
          var n,
            e = new Uint8Array(256)
          for (n = 0; n < 256; n++) e[n] = n
          for (n = 0; n < 255; n++) {
            var i = n + ~~(t() * (256 - n)),
              r = e[n]
            ;(e[n] = e[i]), (e[i] = r)
          }
          return e
        }
        ;(u.prototype = {
          grad3: new Float32Array([
            1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1,
            -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
          ]),
          grad4: new Float32Array([
            0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0,
            -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1,
            0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1,
            0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1,
            1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1,
            1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1,
            -1, 1, 0, -1, -1, -1, 0,
          ]),
          noise2D: function (t, n) {
            var r,
              o,
              s = this.permMod12,
              l = this.perm,
              u = this.grad3,
              a = 0,
              h = 0,
              c = 0,
              f = (t + n) * e,
              _ = Math.floor(t + f),
              $ = Math.floor(n + f),
              p = (_ + $) * i,
              d = t - (_ - p),
              g = n - ($ - p)
            d > g ? ((r = 1), (o = 0)) : ((r = 0), (o = 1))
            var v = d - r + i,
              y = g - o + i,
              m = d - 1 + 2 * i,
              x = g - 1 + 2 * i,
              w = 255 & _,
              b = 255 & $,
              k = 0.5 - d * d - g * g
            if (k >= 0) {
              var S = 3 * s[w + l[b]]
              ;(k *= k), (a = k * k * (u[S] * d + u[S + 1] * g))
            }
            var P = 0.5 - v * v - y * y
            if (P >= 0) {
              var T = 3 * s[w + r + l[b + o]]
              ;(P *= P), (h = P * P * (u[T] * v + u[T + 1] * y))
            }
            var j = 0.5 - m * m - x * x
            if (j >= 0) {
              var A = 3 * s[w + 1 + l[b + 1]]
              ;(j *= j), (c = j * j * (u[A] * m + u[A + 1] * x))
            }
            return 70 * (a + h + c)
          },
          noise3D: function (t, n, e) {
            var i,
              s,
              l,
              u,
              a,
              h,
              c,
              f,
              _,
              $,
              p = this.permMod12,
              d = this.perm,
              g = this.grad3,
              v = (t + n + e) * r,
              y = Math.floor(t + v),
              m = Math.floor(n + v),
              x = Math.floor(e + v),
              w = (y + m + x) * o,
              b = t - (y - w),
              k = n - (m - w),
              S = e - (x - w)
            b >= k
              ? k >= S
                ? ((a = 1), (h = 0), (c = 0), (f = 1), (_ = 1), ($ = 0))
                : b >= S
                  ? ((a = 1), (h = 0), (c = 0), (f = 1), (_ = 0), ($ = 1))
                  : ((a = 0), (h = 0), (c = 1), (f = 1), (_ = 0), ($ = 1))
              : k < S
                ? ((a = 0), (h = 0), (c = 1), (f = 0), (_ = 1), ($ = 1))
                : b < S
                  ? ((a = 0), (h = 1), (c = 0), (f = 0), (_ = 1), ($ = 1))
                  : ((a = 0), (h = 1), (c = 0), (f = 1), (_ = 1), ($ = 0))
            var P = b - a + o,
              T = k - h + o,
              j = S - c + o,
              A = b - f + 2 * o,
              C = k - _ + 2 * o,
              q = S - $ + 2 * o,
              I = b - 1 + 3 * o,
              N = k - 1 + 3 * o,
              z = S - 1 + 3 * o,
              X = 255 & y,
              E = 255 & m,
              L = 255 & x,
              O = 0.6 - b * b - k * k - S * S
            if (O < 0) i = 0
            else {
              var H = 3 * p[X + d[E + d[L]]]
              ;(O *= O), (i = O * O * (g[H] * b + g[H + 1] * k + g[H + 2] * S))
            }
            var R = 0.6 - P * P - T * T - j * j
            if (R < 0) s = 0
            else {
              var M = 3 * p[X + a + d[E + h + d[L + c]]]
              ;(R *= R), (s = R * R * (g[M] * P + g[M + 1] * T + g[M + 2] * j))
            }
            var D = 0.6 - A * A - C * C - q * q
            if (D < 0) l = 0
            else {
              var Y = 3 * p[X + f + d[E + _ + d[L + $]]]
              ;(D *= D), (l = D * D * (g[Y] * A + g[Y + 1] * C + g[Y + 2] * q))
            }
            var B = 0.6 - I * I - N * N - z * z
            if (B < 0) u = 0
            else {
              var K = 3 * p[X + 1 + d[E + 1 + d[L + 1]]]
              ;(B *= B), (u = B * B * (g[K] * I + g[K + 1] * N + g[K + 2] * z))
            }
            return 32 * (i + s + l + u)
          },
          noise4D: function (t, n, e, i) {
            var r,
              o,
              u,
              a,
              h,
              c,
              f,
              _,
              $,
              p,
              d,
              g,
              v,
              y,
              m,
              x,
              w,
              b = this.perm,
              k = this.grad4,
              S = (t + n + e + i) * s,
              P = Math.floor(t + S),
              T = Math.floor(n + S),
              j = Math.floor(e + S),
              A = Math.floor(i + S),
              C = (P + T + j + A) * l,
              q = t - (P - C),
              I = n - (T - C),
              N = e - (j - C),
              z = i - (A - C),
              X = 0,
              E = 0,
              L = 0,
              O = 0
            q > I ? X++ : E++,
              q > N ? X++ : L++,
              q > z ? X++ : O++,
              I > N ? E++ : L++,
              I > z ? E++ : O++,
              N > z ? L++ : O++,
              (r = X >= 3 ? 1 : 0),
              (o = E >= 3 ? 1 : 0),
              (u = L >= 3 ? 1 : 0),
              (a = O >= 3 ? 1 : 0),
              (h = X >= 2 ? 1 : 0),
              (c = E >= 2 ? 1 : 0),
              (f = L >= 2 ? 1 : 0),
              (_ = O >= 2 ? 1 : 0),
              ($ = X >= 1 ? 1 : 0),
              (p = E >= 1 ? 1 : 0),
              (d = L >= 1 ? 1 : 0),
              (g = O >= 1 ? 1 : 0)
            var H = q - r + l,
              R = I - o + l,
              M = N - u + l,
              D = z - a + l,
              Y = q - h + 2 * l,
              B = I - c + 2 * l,
              K = N - f + 2 * l,
              V = z - _ + 2 * l,
              F = q - $ + 3 * l,
              U = I - p + 3 * l,
              Z = N - d + 3 * l,
              Q = z - g + 3 * l,
              W = q - 1 + 4 * l,
              G = I - 1 + 4 * l,
              J = N - 1 + 4 * l,
              tt = z - 1 + 4 * l,
              tn = 255 & P,
              te = 255 & T,
              ti = 255 & j,
              tr = 255 & A,
              to = 0.6 - q * q - I * I - N * N - z * z
            if (to < 0) v = 0
            else {
              var ts = (b[tn + b[te + b[ti + b[tr]]]] % 32) * 4
              ;(to *= to),
                (v =
                  to *
                  to *
                  (k[ts] * q + k[ts + 1] * I + k[ts + 2] * N + k[ts + 3] * z))
            }
            var tl = 0.6 - H * H - R * R - M * M - D * D
            if (tl < 0) y = 0
            else {
              var tu = (b[tn + r + b[te + o + b[ti + u + b[tr + a]]]] % 32) * 4
              ;(tl *= tl),
                (y =
                  tl *
                  tl *
                  (k[tu] * H + k[tu + 1] * R + k[tu + 2] * M + k[tu + 3] * D))
            }
            var ta = 0.6 - Y * Y - B * B - K * K - V * V
            if (ta < 0) m = 0
            else {
              var th = (b[tn + h + b[te + c + b[ti + f + b[tr + _]]]] % 32) * 4
              ;(ta *= ta),
                (m =
                  ta *
                  ta *
                  (k[th] * Y + k[th + 1] * B + k[th + 2] * K + k[th + 3] * V))
            }
            var tc = 0.6 - F * F - U * U - Z * Z - Q * Q
            if (tc < 0) x = 0
            else {
              var tf = (b[tn + $ + b[te + p + b[ti + d + b[tr + g]]]] % 32) * 4
              ;(tc *= tc),
                (x =
                  tc *
                  tc *
                  (k[tf] * F + k[tf + 1] * U + k[tf + 2] * Z + k[tf + 3] * Q))
            }
            var t_ = 0.6 - W * W - G * G - J * J - tt * tt
            if (t_ < 0) w = 0
            else {
              var t$ = (b[tn + 1 + b[te + 1 + b[ti + 1 + b[tr + 1]]]] % 32) * 4
              ;(t_ *= t_),
                (w =
                  t_ *
                  t_ *
                  (k[t$] * W + k[t$ + 1] * G + k[t$ + 2] * J + k[t$ + 3] * tt))
            }
            return 27 * (v + y + m + x + w)
          },
        }),
          (u._buildPermutationTable = a),
          'undefined' != typeof define &&
            define.amd &&
            define(function () {
              return u
            }),
          void 0 !== t
            ? (t.SimplexNoise = u)
            : 'undefined' != typeof window && (window.SimplexNoise = u),
          void 0 !== n && (n.exports = u)
      })()
    }),
    k = f(x()),
    S = (0, k.default)()
  function P(t) {
    S = (0, k.default)(t)
  }
  function T() {
    if (Array.isArray(arguments[0])) {
      let t = arguments[0]
      return t[T(0, t.length - 1, !0)]
    }
    {
      let n = arguments[0],
        e = arguments[1],
        i = arguments[2] || !1,
        r = S() * (e - n) + n
      return i ? Math.round(r) : r
    }
  }
  var j = f(w())
  function A(t) {
    return t * t
  }
  function C(t, n) {
    return A(t[0] - n[0]) + A(t[1] - n[1])
  }
  function q(t, n, e) {
    var i = C(n, e)
    if (0 === i) return C(t, n)
    var r = ((t[0] - n[0]) * (e[0] - n[0]) + (t[1] - n[1]) * (e[1] - n[1])) / i
    return (
      (r = Math.max(0, Math.min(1, r))),
      C(t, [n[0] + r * (e[0] - n[0]), n[1] + r * (e[1] - n[1])])
    )
  }
  function I(t, n, e) {
    return Math.sqrt(q(t, n, e))
  }
  var N = 11102230246251565e-32,
    z = 134217729,
    X = (3 + 8 * N) * N
  function E(t, n, e, i, r) {
    let o,
      s,
      l,
      u,
      a = n[0],
      h = i[0],
      c = 0,
      f = 0
    h > a == h > -a ? ((o = a), (a = n[++c])) : ((o = h), (h = i[++f]))
    let _ = 0
    if (c < t && f < e)
      for (
        h > a == h > -a
          ? ((s = a + o), (l = o - (s - a)), (a = n[++c]))
          : ((s = h + o), (l = o - (s - h)), (h = i[++f])),
          o = s,
          0 !== l && (r[_++] = l);
        c < t && f < e;

      )
        h > a == h > -a
          ? ((u = (s = o + a) - o), (l = o - (s - u) + (a - u)), (a = n[++c]))
          : ((u = (s = o + h) - o), (l = o - (s - u) + (h - u)), (h = i[++f])),
          (o = s),
          0 !== l && (r[_++] = l)
    for (; c < t; )
      (u = (s = o + a) - o),
        (l = o - (s - u) + (a - u)),
        (a = n[++c]),
        (o = s),
        0 !== l && (r[_++] = l)
    for (; f < e; )
      (u = (s = o + h) - o),
        (l = o - (s - u) + (h - u)),
        (h = i[++f]),
        (o = s),
        0 !== l && (r[_++] = l)
    return (0 !== o || 0 === _) && (r[_++] = o), _
  }
  function L(t, n) {
    let e = n[0]
    for (let i = 1; i < t; i++) e += n[i]
    return e
  }
  function O(t) {
    return new Float64Array(t)
  }
  var H = (3 + 16 * N) * N,
    R = (2 + 12 * N) * N,
    M = (9 + 64 * N) * N * N,
    D = O(4),
    Y = O(8),
    B = O(12),
    K = O(16),
    V = O(4)
  function F(t, n, e, i, r, o, s) {
    let l,
      u,
      a,
      h,
      c,
      f,
      _,
      $,
      p,
      d,
      g,
      v,
      y,
      m,
      x,
      w,
      b,
      k,
      S = t - r,
      P = e - r,
      T = n - o,
      j = i - o
    ;(m = S * j),
      (_ = (f = z * S) - (f - S)),
      ($ = S - _),
      (p = (f = z * j) - (f - j)),
      (x = $ * (d = j - p) - (m - _ * p - $ * p - _ * d)),
      (w = T * P),
      (_ = (f = z * T) - (f - T)),
      ($ = T - _),
      (p = (f = z * P) - (f - P)),
      (g = x - (b = $ * (d = P - p) - (w - _ * p - $ * p - _ * d))),
      (c = x - g),
      (D[0] = x - (g + c) + (c - b)),
      (c = (v = m + g) - m),
      (g = (y = m - (v - c) + (g - c)) - w),
      (c = y - g),
      (D[1] = y - (g + c) + (c - w)),
      (c = (k = v + g) - v),
      (D[2] = v - (k - c) + (g - c)),
      (D[3] = k)
    let A = L(4, D),
      C = R * s
    if (
      A >= C ||
      -A >= C ||
      ((c = t - S),
      (l = t - (S + c) + (c - r)),
      (c = e - P),
      (a = e - (P + c) + (c - r)),
      (c = n - T),
      (u = n - (T + c) + (c - o)),
      (c = i - j),
      (h = i - (j + c) + (c - o)),
      0 === l && 0 === u && 0 === a && 0 === h) ||
      ((C = M * s + X * Math.abs(A)),
      (A += S * h + j * l - (T * a + P * u)) >= C || -A >= C)
    )
      return A
    ;(m = l * j),
      (_ = (f = z * l) - (f - l)),
      ($ = l - _),
      (p = (f = z * j) - (f - j)),
      (x = $ * (d = j - p) - (m - _ * p - $ * p - _ * d)),
      (w = u * P),
      (_ = (f = z * u) - (f - u)),
      ($ = u - _),
      (p = (f = z * P) - (f - P)),
      (g = x - (b = $ * (d = P - p) - (w - _ * p - $ * p - _ * d))),
      (c = x - g),
      (V[0] = x - (g + c) + (c - b)),
      (c = (v = m + g) - m),
      (g = (y = m - (v - c) + (g - c)) - w),
      (c = y - g),
      (V[1] = y - (g + c) + (c - w)),
      (c = (k = v + g) - v),
      (V[2] = v - (k - c) + (g - c)),
      (V[3] = k)
    let q = E(4, D, 4, V, Y)
    ;(m = S * h),
      (_ = (f = z * S) - (f - S)),
      ($ = S - _),
      (p = (f = z * h) - (f - h)),
      (x = $ * (d = h - p) - (m - _ * p - $ * p - _ * d)),
      (w = T * a),
      (_ = (f = z * T) - (f - T)),
      ($ = T - _),
      (p = (f = z * a) - (f - a)),
      (g = x - (b = $ * (d = a - p) - (w - _ * p - $ * p - _ * d))),
      (c = x - g),
      (V[0] = x - (g + c) + (c - b)),
      (c = (v = m + g) - m),
      (g = (y = m - (v - c) + (g - c)) - w),
      (c = y - g),
      (V[1] = y - (g + c) + (c - w)),
      (c = (k = v + g) - v),
      (V[2] = v - (k - c) + (g - c)),
      (V[3] = k)
    let I = E(q, Y, 4, V, B)
    return (
      ((m = l * h),
      (_ = (f = z * l) - (f - l)),
      ($ = l - _),
      (p = (f = z * h) - (f - h)),
      (x = $ * (d = h - p) - (m - _ * p - $ * p - _ * d)),
      (w = u * a),
      (_ = (f = z * u) - (f - u)),
      ($ = u - _),
      (p = (f = z * a) - (f - a)),
      (g = x - (b = $ * (d = a - p) - (w - _ * p - $ * p - _ * d))),
      (c = x - g),
      (V[0] = x - (g + c) + (c - b)),
      (c = (v = m + g) - m),
      (g = (y = m - (v - c) + (g - c)) - w),
      (c = y - g),
      (V[1] = y - (g + c) + (c - w)),
      (c = (k = v + g) - v),
      (V[2] = v - (k - c) + (g - c)),
      (V[3] = k)),
      K[E(I, B, 4, V, K) - 1]
    )
  }
  function U(t, n, e, i, r, o) {
    let s = (n - o) * (e - r),
      l = (t - r) * (i - o),
      u = s - l
    if (0 === s || 0 === l || s > 0 != l > 0) return u
    let a = Math.abs(s + l)
    return Math.abs(u) >= H * a ? u : -F(t, n, e, i, r, o, a)
  }
  var Z = (7 + 56 * N) * N,
    Q = (3 + 28 * N) * N,
    W = (26 + 288 * N) * N * N,
    G = O(4),
    J = O(4),
    tt = O(4),
    tn = O(4),
    te = O(4),
    ti = O(4),
    tr = O(4),
    to = O(4),
    ts = O(4),
    tl = O(8),
    tu = O(8),
    ta = O(8),
    th = O(4),
    tc = O(8),
    tf = O(8),
    t_ = O(8),
    t$ = O(12),
    tp = O(192),
    td = O(192),
    t0 = (10 + 96 * N) * N,
    tg = (4 + 48 * N) * N,
    t8 = (44 + 576 * N) * N * N,
    tv = O(4),
    ty = O(4),
    tm = O(4),
    tx = O(4),
    tw = O(4),
    t3 = O(4),
    t2 = O(4),
    t1 = O(4),
    t4 = O(8),
    tb = O(8),
    t5 = O(8),
    t7 = O(8),
    t6 = O(8),
    tk = O(8),
    tS = O(8),
    tP = O(8),
    tT = O(8),
    tj = O(4),
    tA = O(4),
    tC = O(4),
    tq = O(8),
    tI = O(16),
    tN = O(16),
    t9 = O(16),
    tz = O(32),
    tX = O(32),
    tE = O(48),
    tL = O(64),
    tO = O(1152),
    tH = O(1152),
    tR = (16 + 224 * N) * N,
    tM = (5 + 72 * N) * N,
    tD = (71 + 1408 * N) * N * N,
    tY = O(4),
    tB = O(4),
    tK = O(4),
    tV = O(4),
    tF = O(4),
    tU = O(4),
    tZ = O(4),
    tQ = O(4),
    tW = O(4),
    tG = O(4),
    tJ = O(24),
    nt = O(24),
    nn = O(24),
    ne = O(24),
    ni = O(24),
    nr = O(24),
    no = O(24),
    ns = O(24),
    nl = O(24),
    nu = O(24),
    na = O(1152),
    nh = O(1152),
    nc = O(1152),
    nf = O(1152),
    n_ = O(1152),
    n$ = O(2304),
    np = O(2304),
    nd = O(3456),
    n0 = O(5760),
    ng = O(8),
    n8 = O(8),
    nv = O(8),
    ny = O(16),
    nm = O(24),
    nx = O(48),
    nw = O(48),
    n3 = O(96),
    n2 = O(192),
    n1 = O(384),
    n4 = O(384),
    nb = O(384),
    n5 = O(768),
    n7 = O(96),
    n6 = O(96),
    nk = O(96),
    nS = O(1152),
    nP = 2220446049250313e-31,
    nT = new Uint32Array(512),
    nj = class {
      static from(t, n = nX, e = nE) {
        let i = t.length,
          r = new Float64Array(2 * i)
        for (let o = 0; o < i; o++) {
          let s = t[o]
          ;(r[2 * o] = n(s)), (r[2 * o + 1] = e(s))
        }
        return new nj(r)
      }
      constructor(t) {
        let n = t.length >> 1
        if (n > 0 && 'number' != typeof t[0])
          throw Error('Expected coords to contain numbers.')
        this.coords = t
        let e = Math.max(2 * n - 5, 0)
        ;(this._triangles = new Uint32Array(3 * e)),
          (this._halfedges = new Int32Array(3 * e)),
          (this._hashSize = Math.ceil(Math.sqrt(n))),
          (this._hullPrev = new Uint32Array(n)),
          (this._hullNext = new Uint32Array(n)),
          (this._hullTri = new Uint32Array(n)),
          (this._hullHash = new Int32Array(this._hashSize).fill(-1)),
          (this._ids = new Uint32Array(n)),
          (this._dists = new Float64Array(n)),
          this.update()
      }
      update() {
        let {
            coords: t,
            _hullPrev: n,
            _hullNext: e,
            _hullTri: i,
            _hullHash: r,
          } = this,
          o = t.length >> 1,
          s = 1 / 0,
          l = 1 / 0,
          u = -1 / 0,
          a = -1 / 0
        for (let h = 0; h < o; h++) {
          let c = t[2 * h],
            f = t[2 * h + 1]
          c < s && (s = c),
            f < l && (l = f),
            c > u && (u = c),
            f > a && (a = f),
            (this._ids[h] = h)
        }
        let _ = (s + u) / 2,
          $ = (l + a) / 2,
          p = 1 / 0,
          d,
          g,
          v
        for (let y = 0; y < o; y++) {
          let m = nC(_, $, t[2 * y], t[2 * y + 1])
          m < p && ((d = y), (p = m))
        }
        let x = t[2 * d],
          w = t[2 * d + 1]
        p = 1 / 0
        for (let b = 0; b < o; b++) {
          if (b === d) continue
          let k = nC(x, w, t[2 * b], t[2 * b + 1])
          k < p && k > 0 && ((g = b), (p = k))
        }
        let S = t[2 * g],
          P = t[2 * g + 1],
          T = 1 / 0
        for (let j = 0; j < o; j++) {
          if (j === d || j === g) continue
          let A = nI(x, w, S, P, t[2 * j], t[2 * j + 1])
          A < T && ((v = j), (T = A))
        }
        let C = t[2 * v],
          q = t[2 * v + 1]
        if (T === 1 / 0) {
          for (let I = 0; I < o; I++)
            this._dists[I] = t[2 * I] - t[0] || t[2 * I + 1] - t[1]
          n9(this._ids, this._dists, 0, o - 1)
          let N = new Uint32Array(o),
            z = 0
          for (let X = 0, E = -1 / 0; X < o; X++) {
            let L = this._ids[X]
            this._dists[L] > E && ((N[z++] = L), (E = this._dists[L]))
          }
          ;(this.hull = N.subarray(0, z)),
            (this.triangles = new Uint32Array(0)),
            (this.halfedges = new Uint32Array(0))
          return
        }
        if (0 > U(x, w, S, P, C, q)) {
          let O = g,
            H = S,
            R = P
          ;(g = v), (S = C), (P = q), (v = O), (C = H), (q = R)
        }
        let M = nN(x, w, S, P, C, q)
        ;(this._cx = M.x), (this._cy = M.y)
        for (let D = 0; D < o; D++)
          this._dists[D] = nC(t[2 * D], t[2 * D + 1], M.x, M.y)
        n9(this._ids, this._dists, 0, o - 1), (this._hullStart = d)
        let Y = 3
        ;(e[d] = n[v] = g),
          (e[g] = n[d] = v),
          (e[v] = n[g] = d),
          (i[d] = 0),
          (i[g] = 1),
          (i[v] = 2),
          r.fill(-1),
          (r[this._hashKey(x, w)] = d),
          (r[this._hashKey(S, P)] = g),
          (r[this._hashKey(C, q)] = v),
          (this.trianglesLen = 0),
          this._addTriangle(d, g, v, -1, -1, -1)
        for (let B = 0, K, V; B < this._ids.length; B++) {
          let F = this._ids[B],
            Z = t[2 * F],
            Q = t[2 * F + 1]
          if (
            (B > 0 && Math.abs(Z - K) <= nP && Math.abs(Q - V) <= nP) ||
            ((K = Z), (V = Q), F === d || F === g || F === v)
          )
            continue
          let W = 0
          for (
            let G = 0, J = this._hashKey(Z, Q);
            G < this._hashSize &&
            !(-1 !== (W = r[(J + G) % this._hashSize]) && W !== e[W]);
            G++
          );
          let tt = (W = n[W]),
            tn
          for (
            ;
            (tn = e[tt]),
              U(Z, Q, t[2 * tt], t[2 * tt + 1], t[2 * tn], t[2 * tn + 1]) >= 0;

          )
            if ((tt = tn) === W) {
              tt = -1
              break
            }
          if (-1 === tt) continue
          let te = this._addTriangle(tt, F, e[tt], -1, -1, i[tt])
          ;(i[F] = this._legalize(te + 2)), (i[tt] = te), Y++
          let ti = e[tt]
          for (
            ;
            (tn = e[ti]),
              0 > U(Z, Q, t[2 * ti], t[2 * ti + 1], t[2 * tn], t[2 * tn + 1]);

          )
            (te = this._addTriangle(ti, F, tn, i[F], -1, i[ti])),
              (i[F] = this._legalize(te + 2)),
              (e[ti] = ti),
              Y--,
              (ti = tn)
          if (tt === W)
            for (
              ;
              0 >
              U(
                Z,
                Q,
                t[2 * (tn = n[tt])],
                t[2 * tn + 1],
                t[2 * tt],
                t[2 * tt + 1]
              );

            )
              (te = this._addTriangle(tn, F, tt, -1, i[tt], i[tn])),
                this._legalize(te + 2),
                (i[tn] = te),
                (e[tt] = tt),
                Y--,
                (tt = tn)
          ;(this._hullStart = n[F] = tt),
            (e[tt] = n[ti] = F),
            (e[F] = ti),
            (r[this._hashKey(Z, Q)] = F),
            (r[this._hashKey(t[2 * tt], t[2 * tt + 1])] = tt)
        }
        this.hull = new Uint32Array(Y)
        for (let tr = 0, to = this._hullStart; tr < Y; tr++)
          (this.hull[tr] = to), (to = e[to])
        ;(this.triangles = this._triangles.subarray(0, this.trianglesLen)),
          (this.halfedges = this._halfedges.subarray(0, this.trianglesLen))
      }
      _hashKey(t, n) {
        return (
          Math.floor(nA(t - this._cx, n - this._cy) * this._hashSize) %
          this._hashSize
        )
      }
      _legalize(t) {
        let { _triangles: n, _halfedges: e, coords: i } = this,
          r = 0,
          o = 0
        for (;;) {
          let s = e[t],
            l = t - (t % 3)
          if (((o = l + ((t + 2) % 3)), -1 === s)) {
            if (0 === r) break
            t = nT[--r]
            continue
          }
          let u = s - (s % 3),
            a = l + ((t + 1) % 3),
            h = u + ((s + 2) % 3),
            c = n[o],
            f = n[t],
            _ = n[a],
            $ = n[h]
          if (
            nq(
              i[2 * c],
              i[2 * c + 1],
              i[2 * f],
              i[2 * f + 1],
              i[2 * _],
              i[2 * _ + 1],
              i[2 * $],
              i[2 * $ + 1]
            )
          ) {
            ;(n[t] = $), (n[s] = c)
            let p = e[h]
            if (-1 === p) {
              let d = this._hullStart
              do {
                if (this._hullTri[d] === h) {
                  this._hullTri[d] = t
                  break
                }
                d = this._hullPrev[d]
              } while (d !== this._hullStart)
            }
            this._link(t, p), this._link(s, e[o]), this._link(o, h)
            let g = u + ((s + 1) % 3)
            r < nT.length && (nT[r++] = g)
          } else {
            if (0 === r) break
            t = nT[--r]
          }
        }
        return o
      }
      _link(t, n) {
        ;(this._halfedges[t] = n), -1 !== n && (this._halfedges[n] = t)
      }
      _addTriangle(t, n, e, i, r, o) {
        let s = this.trianglesLen
        return (
          (this._triangles[s] = t),
          (this._triangles[s + 1] = n),
          (this._triangles[s + 2] = e),
          this._link(s, i),
          this._link(s + 1, r),
          this._link(s + 2, o),
          (this.trianglesLen += 3),
          s
        )
      }
    }
  function nA(t, n) {
    let e = t / (Math.abs(t) + Math.abs(n))
    return (n > 0 ? 3 - e : 1 + e) / 4
  }
  function nC(t, n, e, i) {
    let r = t - e,
      o = n - i
    return r * r + o * o
  }
  function nq(t, n, e, i, r, o, s, l) {
    let u = t - s,
      a = n - l,
      h = e - s,
      c = i - l,
      f = r - s,
      _ = o - l,
      $ = h * h + c * c,
      p = f * f + _ * _
    return (
      u * (c * p - $ * _) -
        a * (h * p - $ * f) +
        (u * u + a * a) * (h * _ - c * f) <
      0
    )
  }
  function nI(t, n, e, i, r, o) {
    let s = e - t,
      l = i - n,
      u = r - t,
      a = o - n,
      h = s * s + l * l,
      c = u * u + a * a,
      f = 0.5 / (s * a - l * u),
      _ = (a * h - l * c) * f,
      $ = (s * c - u * h) * f
    return _ * _ + $ * $
  }
  function nN(t, n, e, i, r, o) {
    let s = e - t,
      l = i - n,
      u = r - t,
      a = o - n,
      h = s * s + l * l,
      c = u * u + a * a,
      f = 0.5 / (s * a - l * u)
    return { x: t + (a * h - l * c) * f, y: n + (s * c - u * h) * f }
  }
  function n9(t, n, e, i) {
    if (i - e <= 20)
      for (let r = e + 1; r <= i; r++) {
        let o = t[r],
          s = n[o],
          l = r - 1
        for (; l >= e && n[t[l]] > s; ) t[l + 1] = t[l--]
        t[l + 1] = o
      }
    else {
      let u = e + 1,
        a = i
      nz(t, (e + i) >> 1, u),
        n[t[e]] > n[t[i]] && nz(t, e, i),
        n[t[u]] > n[t[i]] && nz(t, u, i),
        n[t[e]] > n[t[u]] && nz(t, e, u)
      let h = t[u],
        c = n[h]
      for (;;) {
        do u++
        while (n[t[u]] < c)
        do a--
        while (n[t[a]] > c)
        if (a < u) break
        nz(t, u, a)
      }
      ;(t[e + 1] = t[a]),
        (t[a] = h),
        i - u + 1 >= a - e
          ? (n9(t, n, u, i), n9(t, n, e, a - 1))
          : (n9(t, n, e, a - 1), n9(t, n, u, i))
    }
  }
  function nz(t, n, e) {
    let i = t[n]
    ;(t[n] = t[e]), (t[e] = i)
  }
  function nX(t) {
    return t[0]
  }
  function nE(t) {
    return t[1]
  }
  var nL = 1e-6,
    nO = class {
      constructor() {
        ;(this._x0 = this._y0 = this._x1 = this._y1 = null), (this._ = '')
      }
      moveTo(t, n) {
        this._ += `M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +n)}`
      }
      closePath() {
        null !== this._x1 &&
          ((this._x1 = this._x0), (this._y1 = this._y0), (this._ += 'Z'))
      }
      lineTo(t, n) {
        this._ += `L${(this._x1 = +t)},${(this._y1 = +n)}`
      }
      arc(t, n, e) {
        ;(t = +t), (n = +n)
        let i = t + (e = +e),
          r = n
        if (e < 0) throw Error('negative radius')
        null === this._x1
          ? (this._ += `M${i},${r}`)
          : (Math.abs(this._x1 - i) > nL || Math.abs(this._y1 - r) > nL) &&
            (this._ += 'L' + i + ',' + r),
          e &&
            (this._ += `A${e},${e},0,1,1,${t - e},${n}A${e},${e},0,1,1,${(this._x1 = i)},${(this._y1 = r)}`)
      }
      rect(t, n, e, i) {
        this._ += `M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +n)}h${+e}v${+i}h${-e}Z`
      }
      value() {
        return this._ || null
      }
    },
    nH = class {
      constructor() {
        this._ = []
      }
      moveTo(t, n) {
        this._.push([t, n])
      }
      closePath() {
        this._.push(this._[0].slice())
      }
      lineTo(t, n) {
        this._.push([t, n])
      }
      value() {
        return this._.length ? this._ : null
      }
    },
    nR = class {
      constructor(t, [n, e, i, r] = [0, 0, 960, 500]) {
        if (!((i = +i) >= (n = +n)) || !((r = +r) >= (e = +e)))
          throw Error('invalid bounds')
        ;(this.delaunay = t),
          (this._circumcenters = new Float64Array(2 * t.points.length)),
          (this.vectors = new Float64Array(2 * t.points.length)),
          (this.xmax = i),
          (this.xmin = n),
          (this.ymax = r),
          (this.ymin = e),
          this._init()
      }
      update() {
        return this.delaunay.update(), this._init(), this
      }
      _init() {
        let {
            delaunay: { points: t, hull: n, triangles: e },
            vectors: i,
          } = this,
          r = (this.circumcenters = this._circumcenters.subarray(
            0,
            (e.length / 3) * 2
          ))
        for (let o = 0, s = 0, l = e.length, u, a; o < l; o += 3, s += 2) {
          let h = 2 * e[o],
            c = 2 * e[o + 1],
            f = 2 * e[o + 2],
            _ = t[h],
            $ = t[h + 1],
            p = t[c],
            d = t[c + 1],
            g = t[f],
            v = t[f + 1],
            y = p - _,
            m = d - $,
            x = g - _,
            w = v - $,
            b = (y * w - m * x) * 2
          if (1e-9 > Math.abs(b)) {
            let k = 1e9,
              S = 2 * e[0]
            ;(k *= Math.sign((t[S] - _) * w - (t[S + 1] - $) * x)),
              (u = (_ + g) / 2 - k * w),
              (a = ($ + v) / 2 + k * x)
          } else {
            let P = 1 / b,
              T = y * y + m * m,
              j = x * x + w * w
            ;(u = _ + (w * T - m * j) * P), (a = $ + (y * j - x * T) * P)
          }
          ;(r[s] = u), (r[s + 1] = a)
        }
        let A = n[n.length - 1],
          C,
          q = 4 * A,
          I,
          N = t[2 * A],
          z,
          X = t[2 * A + 1]
        i.fill(0)
        for (let E = 0; E < n.length; ++E)
          (A = n[E]),
            (C = q),
            (I = N),
            (z = X),
            (q = 4 * A),
            (N = t[2 * A]),
            (X = t[2 * A + 1]),
            (i[C + 2] = i[q] = z - X),
            (i[C + 3] = i[q + 1] = N - I)
      }
      render(t) {
        let n = null == t ? (t = new nO()) : void 0,
          {
            delaunay: { halfedges: e, inedges: i, hull: r },
            circumcenters: o,
            vectors: s,
          } = this
        if (r.length <= 1) return null
        for (let l = 0, u = e.length; l < u; ++l) {
          let a = e[l]
          if (a < l) continue
          let h = 2 * Math.floor(l / 3),
            c = 2 * Math.floor(a / 3),
            f = o[h],
            _ = o[h + 1],
            $ = o[c],
            p = o[c + 1]
          this._renderSegment(f, _, $, p, t)
        }
        let d,
          g = r[r.length - 1]
        for (let v = 0; v < r.length; ++v) {
          d = g
          let y = 2 * Math.floor(i[(g = r[v])] / 3),
            m = o[y],
            x = o[y + 1],
            w = 4 * d,
            b = this._project(m, x, s[w + 2], s[w + 3])
          b && this._renderSegment(m, x, b[0], b[1], t)
        }
        return n && n.value()
      }
      renderBounds(t) {
        let n = null == t ? (t = new nO()) : void 0
        return (
          t.rect(
            this.xmin,
            this.ymin,
            this.xmax - this.xmin,
            this.ymax - this.ymin
          ),
          n && n.value()
        )
      }
      renderCell(t, n) {
        let e = null == n ? (n = new nO()) : void 0,
          i = this._clip(t)
        if (null === i || !i.length) return
        n.moveTo(i[0], i[1])
        let r = i.length
        for (; i[0] === i[r - 2] && i[1] === i[r - 1] && r > 1; ) r -= 2
        for (let o = 2; o < r; o += 2)
          (i[o] !== i[o - 2] || i[o + 1] !== i[o - 1]) &&
            n.lineTo(i[o], i[o + 1])
        return n.closePath(), e && e.value()
      }
      *cellPolygons() {
        let {
          delaunay: { points: t },
        } = this
        for (let n = 0, e = t.length / 2; n < e; ++n) {
          let i = this.cellPolygon(n)
          i && ((i.index = n), yield i)
        }
      }
      cellPolygon(t) {
        let n = new nH()
        return this.renderCell(t, n), n.value()
      }
      _renderSegment(t, n, e, i, r) {
        let o,
          s = this._regioncode(t, n),
          l = this._regioncode(e, i)
        0 === s && 0 === l
          ? (r.moveTo(t, n), r.lineTo(e, i))
          : (o = this._clipSegment(t, n, e, i, s, l)) &&
            (r.moveTo(o[0], o[1]), r.lineTo(o[2], o[3]))
      }
      contains(t, n, e) {
        return (
          (n = +n) == n && (e = +e) == e && this.delaunay._step(t, n, e) === t
        )
      }
      *neighbors(t) {
        let n = this._clip(t)
        if (n)
          for (let e of this.delaunay.neighbors(t)) {
            let i = this._clip(e)
            if (i) {
              t: for (let r = 0, o = n.length; r < o; r += 2)
                for (let s = 0, l = i.length; s < l; s += 2)
                  if (
                    n[r] == i[s] &&
                    n[r + 1] == i[s + 1] &&
                    n[(r + 2) % o] == i[(s + l - 2) % l] &&
                    n[(r + 3) % o] == i[(s + l - 1) % l]
                  ) {
                    yield e
                    break t
                  }
            }
          }
      }
      _cell(t) {
        let {
            circumcenters: n,
            delaunay: { inedges: e, halfedges: i, triangles: r },
          } = this,
          o = e[t]
        if (-1 === o) return null
        let s = [],
          l = o
        do {
          let u = Math.floor(l / 3)
          if (
            (s.push(n[2 * u], n[2 * u + 1]),
            r[(l = l % 3 == 2 ? l - 2 : l + 1)] !== t)
          )
            break
          l = i[l]
        } while (l !== o && -1 !== l)
        return s
      }
      _clip(t) {
        if (0 === t && 1 === this.delaunay.hull.length)
          return [
            this.xmax,
            this.ymin,
            this.xmax,
            this.ymax,
            this.xmin,
            this.ymax,
            this.xmin,
            this.ymin,
          ]
        let n = this._cell(t)
        if (null === n) return null
        let { vectors: e } = this,
          i = 4 * t
        return e[i] || e[i + 1]
          ? this._clipInfinite(t, n, e[i], e[i + 1], e[i + 2], e[i + 3])
          : this._clipFinite(t, n)
      }
      _clipFinite(t, n) {
        let e = n.length,
          i = null,
          r,
          o,
          s = n[e - 2],
          l = n[e - 1],
          u,
          a = this._regioncode(s, l),
          h,
          c = 0
        for (let f = 0; f < e; f += 2)
          if (
            ((r = s),
            (o = l),
            (s = n[f]),
            (l = n[f + 1]),
            (u = a),
            (a = this._regioncode(s, l)),
            0 === u && 0 === a)
          )
            (h = c), (c = 0), i ? i.push(s, l) : (i = [s, l])
          else {
            let _, $, p, d, g
            if (0 === u) {
              if (null === (_ = this._clipSegment(r, o, s, l, u, a))) continue
              ;[$, p, d, g] = _
            } else {
              if (null === (_ = this._clipSegment(s, l, r, o, a, u))) continue
              ;([d, g, $, p] = _),
                (h = c),
                (c = this._edgecode($, p)),
                h && c && this._edge(t, h, c, i, i.length),
                i ? i.push($, p) : (i = [$, p])
            }
            ;(h = c),
              (c = this._edgecode(d, g)),
              h && c && this._edge(t, h, c, i, i.length),
              i ? i.push(d, g) : (i = [d, g])
          }
        if (i)
          (h = c),
            (c = this._edgecode(i[0], i[1])),
            h && c && this._edge(t, h, c, i, i.length)
        else if (
          this.contains(
            t,
            (this.xmin + this.xmax) / 2,
            (this.ymin + this.ymax) / 2
          )
        )
          return [
            this.xmax,
            this.ymin,
            this.xmax,
            this.ymax,
            this.xmin,
            this.ymax,
            this.xmin,
            this.ymin,
          ]
        return i
      }
      _clipSegment(t, n, e, i, r, o) {
        for (;;) {
          if (0 === r && 0 === o) return [t, n, e, i]
          if (r & o) return null
          let s,
            l,
            u = r || o
          8 & u
            ? ((s = t + ((e - t) * (this.ymax - n)) / (i - n)), (l = this.ymax))
            : 4 & u
              ? ((s = t + ((e - t) * (this.ymin - n)) / (i - n)),
                (l = this.ymin))
              : 2 & u
                ? ((l = n + ((i - n) * (this.xmax - t)) / (e - t)),
                  (s = this.xmax))
                : ((l = n + ((i - n) * (this.xmin - t)) / (e - t)),
                  (s = this.xmin)),
            r
              ? ((t = s), (n = l), (r = this._regioncode(t, n)))
              : ((e = s), (i = l), (o = this._regioncode(e, i)))
        }
      }
      _clipInfinite(t, n, e, i, r, o) {
        let s = Array.from(n),
          l
        if (
          ((l = this._project(s[0], s[1], e, i)) && s.unshift(l[0], l[1]),
          (l = this._project(s[s.length - 2], s[s.length - 1], r, o)) &&
            s.push(l[0], l[1]),
          (s = this._clipFinite(t, s)))
        )
          for (
            let u = 0, a = s.length, h, c = this._edgecode(s[a - 2], s[a - 1]);
            u < a;
            u += 2
          )
            (h = c),
              (c = this._edgecode(s[u], s[u + 1])),
              h && c && ((u = this._edge(t, h, c, s, u)), (a = s.length))
        else
          this.contains(
            t,
            (this.xmin + this.xmax) / 2,
            (this.ymin + this.ymax) / 2
          ) &&
            (s = [
              this.xmin,
              this.ymin,
              this.xmax,
              this.ymin,
              this.xmax,
              this.ymax,
              this.xmin,
              this.ymax,
            ])
        return s
      }
      _edge(t, n, e, i, r) {
        for (; n !== e; ) {
          let o, s
          switch (n) {
            case 5:
              n = 4
              continue
            case 4:
              ;(n = 6), (o = this.xmax), (s = this.ymin)
              break
            case 6:
              n = 2
              continue
            case 2:
              ;(n = 10), (o = this.xmax), (s = this.ymax)
              break
            case 10:
              n = 8
              continue
            case 8:
              ;(n = 9), (o = this.xmin), (s = this.ymax)
              break
            case 9:
              n = 1
              continue
            case 1:
              ;(n = 5), (o = this.xmin), (s = this.ymin)
          }
          ;(i[r] !== o || i[r + 1] !== s) &&
            this.contains(t, o, s) &&
            (i.splice(r, 0, o, s), (r += 2))
        }
        if (i.length > 4)
          for (let l = 0; l < i.length; l += 2) {
            let u = (l + 2) % i.length,
              a = (l + 4) % i.length
            ;((i[l] === i[u] && i[u] === i[a]) ||
              (i[l + 1] === i[u + 1] && i[u + 1] === i[a + 1])) &&
              (i.splice(u, 2), (l -= 2))
          }
        return r
      }
      _project(t, n, e, i) {
        let r = 1 / 0,
          o,
          s,
          l
        if (i < 0) {
          if (n <= this.ymin) return null
          ;(o = (this.ymin - n) / i) < r &&
            ((l = this.ymin), (s = t + (r = o) * e))
        } else if (i > 0) {
          if (n >= this.ymax) return null
          ;(o = (this.ymax - n) / i) < r &&
            ((l = this.ymax), (s = t + (r = o) * e))
        }
        if (e > 0) {
          if (t >= this.xmax) return null
          ;(o = (this.xmax - t) / e) < r &&
            ((s = this.xmax), (l = n + (r = o) * i))
        } else if (e < 0) {
          if (t <= this.xmin) return null
          ;(o = (this.xmin - t) / e) < r &&
            ((s = this.xmin), (l = n + (r = o) * i))
        }
        return [s, l]
      }
      _edgecode(t, n) {
        return (
          (t === this.xmin ? 1 : t === this.xmax ? 2 : 0) |
          (n === this.ymin ? 4 : n === this.ymax ? 8 : 0)
        )
      }
      _regioncode(t, n) {
        return (
          (t < this.xmin ? 1 : t > this.xmax ? 2 : 0) |
          (n < this.ymin ? 4 : n > this.ymax ? 8 : 0)
        )
      }
    },
    nM = 2 * Math.PI,
    nD = Math.pow
  function nY(t) {
    return t[0]
  }
  function nB(t) {
    return t[1]
  }
  function nK(t) {
    let { triangles: n, coords: e } = t
    for (let i = 0; i < n.length; i += 3) {
      let r = 2 * n[i],
        o = 2 * n[i + 1],
        s = 2 * n[i + 2]
      if (
        (e[s] - e[r]) * (e[o + 1] - e[r + 1]) -
          (e[o] - e[r]) * (e[s + 1] - e[r + 1]) >
        1e-10
      )
        return !1
    }
    return !0
  }
  function nV(t, n, e) {
    return [t + Math.sin(t + n) * e, n + Math.cos(t - n) * e]
  }
  var nF = class {
    static from(t, n = nY, e = nB, i) {
      return new nF(
        'length' in t ? nU(t, n, e, i) : Float64Array.from(nZ(t, n, e, i))
      )
    }
    constructor(t) {
      ;(this._delaunator = new nj(t)),
        (this.inedges = new Int32Array(t.length / 2)),
        (this._hullIndex = new Int32Array(t.length / 2)),
        (this.points = this._delaunator.coords),
        this._init()
    }
    update() {
      return this._delaunator.update(), this._init(), this
    }
    _init() {
      let t = this._delaunator,
        n = this.points
      if (t.hull && t.hull.length > 2 && nK(t)) {
        this.collinear = Int32Array.from(
          { length: n.length / 2 },
          (t, n) => n
        ).sort((t, e) => n[2 * t] - n[2 * e] || n[2 * t + 1] - n[2 * e + 1])
        let e = this.collinear[0],
          i = this.collinear[this.collinear.length - 1],
          r = [n[2 * e], n[2 * e + 1], n[2 * i], n[2 * i + 1]],
          o = 1e-8 * Math.hypot(r[3] - r[1], r[2] - r[0])
        for (let s = 0, l = n.length / 2; s < l; ++s) {
          let u = nV(n[2 * s], n[2 * s + 1], o)
          ;(n[2 * s] = u[0]), (n[2 * s + 1] = u[1])
        }
        this._delaunator = new nj(n)
      } else delete this.collinear
      let a = (this.halfedges = this._delaunator.halfedges),
        h = (this.hull = this._delaunator.hull),
        c = (this.triangles = this._delaunator.triangles),
        f = this.inedges.fill(-1),
        _ = this._hullIndex.fill(-1)
      for (let $ = 0, p = a.length; $ < p; ++$) {
        let d = c[$ % 3 == 2 ? $ - 2 : $ + 1]
        ;(-1 === a[$] || -1 === f[d]) && (f[d] = $)
      }
      for (let g = 0, v = h.length; g < v; ++g) _[h[g]] = g
      h.length <= 2 &&
        h.length > 0 &&
        ((this.triangles = new Int32Array(3).fill(-1)),
        (this.halfedges = new Int32Array(3).fill(-1)),
        (this.triangles[0] = h[0]),
        (f[h[0]] = 1),
        2 === h.length &&
          ((f[h[1]] = 0),
          (this.triangles[1] = h[1]),
          (this.triangles[2] = h[1])))
    }
    voronoi(t) {
      return new nR(this, t)
    }
    *neighbors(t) {
      let {
        inedges: n,
        hull: e,
        _hullIndex: i,
        halfedges: r,
        triangles: o,
        collinear: s,
      } = this
      if (s) {
        let l = s.indexOf(t)
        l > 0 && (yield s[l - 1]), l < s.length - 1 && (yield s[l + 1])
        return
      }
      let u = n[t]
      if (-1 === u) return
      let a = u,
        h = -1
      do {
        if ((yield (h = o[a]), o[(a = a % 3 == 2 ? a - 2 : a + 1)] !== t))
          return
        if (-1 === (a = r[a])) {
          let c = e[(i[t] + 1) % e.length]
          c !== h && (yield c)
          return
        }
      } while (a !== u)
    }
    find(t, n, e = 0) {
      if ((t = +t) != t || (n = +n) != n) return -1
      let i = e,
        r
      for (; (r = this._step(e, t, n)) >= 0 && r !== e && r !== i; ) e = r
      return r
    }
    _step(t, n, e) {
      let {
        inedges: i,
        hull: r,
        _hullIndex: o,
        halfedges: s,
        triangles: l,
        points: u,
      } = this
      if (-1 === i[t] || !u.length) return (t + 1) % (u.length >> 1)
      let a = t,
        h = nD(n - u[2 * t], 2) + nD(e - u[2 * t + 1], 2),
        c = i[t],
        f = c
      do {
        let _ = l[f],
          $ = nD(n - u[2 * _], 2) + nD(e - u[2 * _ + 1], 2)
        if (
          ($ < h && ((h = $), (a = _)),
          l[(f = f % 3 == 2 ? f - 2 : f + 1)] !== t)
        )
          break
        if (-1 === (f = s[f])) {
          if (
            (f = r[(o[t] + 1) % r.length]) !== _ &&
            nD(n - u[2 * f], 2) + nD(e - u[2 * f + 1], 2) < h
          )
            return f
          break
        }
      } while (f !== c)
      return a
    }
    render(t) {
      let n = null == t ? (t = new nO()) : void 0,
        { points: e, halfedges: i, triangles: r } = this
      for (let o = 0, s = i.length; o < s; ++o) {
        let l = i[o]
        if (l < o) continue
        let u = 2 * r[o],
          a = 2 * r[l]
        t.moveTo(e[u], e[u + 1]), t.lineTo(e[a], e[a + 1])
      }
      return this.renderHull(t), n && n.value()
    }
    renderPoints(t, n) {
      void 0 !== n ||
        (t && 'function' == typeof t.moveTo) ||
        ((n = t), (t = null)),
        (n = null == n ? 2 : +n)
      let e = null == t ? (t = new nO()) : void 0,
        { points: i } = this
      for (let r = 0, o = i.length; r < o; r += 2) {
        let s = i[r],
          l = i[r + 1]
        t.moveTo(s + n, l), t.arc(s, l, n, 0, nM)
      }
      return e && e.value()
    }
    renderHull(t) {
      let n = null == t ? (t = new nO()) : void 0,
        { hull: e, points: i } = this,
        r = 2 * e[0],
        o = e.length
      t.moveTo(i[r], i[r + 1])
      for (let s = 1; s < o; ++s) {
        let l = 2 * e[s]
        t.lineTo(i[l], i[l + 1])
      }
      return t.closePath(), n && n.value()
    }
    hullPolygon() {
      let t = new nH()
      return this.renderHull(t), t.value()
    }
    renderTriangle(t, n) {
      let e = null == n ? (n = new nO()) : void 0,
        { points: i, triangles: r } = this,
        o = 2 * r[(t *= 3)],
        s = 2 * r[t + 1],
        l = 2 * r[t + 2]
      return (
        n.moveTo(i[o], i[o + 1]),
        n.lineTo(i[s], i[s + 1]),
        n.lineTo(i[l], i[l + 1]),
        n.closePath(),
        e && e.value()
      )
    }
    *trianglePolygons() {
      let { triangles: t } = this
      for (let n = 0, e = t.length / 3; n < e; ++n)
        yield this.trianglePolygon(n)
    }
    trianglePolygon(t) {
      let n = new nH()
      return this.renderTriangle(t, n), n.value()
    }
  }
  function nU(t, n, e, i) {
    let r = t.length,
      o = new Float64Array(2 * r)
    for (let s = 0; s < r; ++s) {
      let l = t[s]
      ;(o[2 * s] = n.call(i, l, s, t)), (o[2 * s + 1] = e.call(i, l, s, t))
    }
    return o
  }
  function* nZ(t, n, e, i) {
    let r = 0
    for (let o of t) yield n.call(i, o, r, t), yield e.call(i, o, r, t), ++r
  }
  var nQ = { value() {} }
  function nW() {
    for (var t, n = 0, e = arguments.length, i = {}; n < e; ++n) {
      if (!(t = arguments[n] + '') || t in i || /[\s.]/.test(t))
        throw Error('illegal type: ' + t)
      i[t] = []
    }
    return new nG(i)
  }
  function nG(t) {
    this._ = t
  }
  function nJ(t, n) {
    return t
      .trim()
      .split(/^|\s+/)
      .map(function (t) {
        var e = '',
          i = t.indexOf('.')
        if (
          (i >= 0 && ((e = t.slice(i + 1)), (t = t.slice(0, i))),
          t && !n.hasOwnProperty(t))
        )
          throw Error('unknown type: ' + t)
        return { type: t, name: e }
      })
  }
  function et(t, n) {
    for (var e, i = 0, r = t.length; i < r; ++i)
      if ((e = t[i]).name === n) return e.value
  }
  function en(t, n, e) {
    for (var i = 0, r = t.length; i < r; ++i)
      if (t[i].name === n) {
        ;(t[i] = nQ), (t = t.slice(0, i).concat(t.slice(i + 1)))
        break
      }
    return null != e && t.push({ name: n, value: e }), t
  }
  nG.prototype = nW.prototype = {
    constructor: nG,
    on: function (t, n) {
      var e,
        i = this._,
        r = nJ(t + '', i),
        o = -1,
        s = r.length
      if (arguments.length < 2) {
        for (; ++o < s; )
          if ((e = (t = r[o]).type) && (e = et(i[e], t.name))) return e
        return
      }
      if (null != n && 'function' != typeof n)
        throw Error('invalid callback: ' + n)
      for (; ++o < s; )
        if ((e = (t = r[o]).type)) i[e] = en(i[e], t.name, n)
        else if (null == n) for (e in i) i[e] = en(i[e], t.name, null)
      return this
    },
    copy: function () {
      var t = {},
        n = this._
      for (var e in n) t[e] = n[e].slice()
      return new nG(t)
    },
    call: function (t, n) {
      if ((e = arguments.length - 2) > 0)
        for (var e, i, r = Array(e), o = 0; o < e; ++o) r[o] = arguments[o + 2]
      if (!this._.hasOwnProperty(t)) throw Error('unknown type: ' + t)
      for (i = this._[t], o = 0, e = i.length; o < e; ++o)
        i[o].value.apply(n, r)
    },
    apply: function (t, n, e) {
      if (!this._.hasOwnProperty(t)) throw Error('unknown type: ' + t)
      for (var i = this._[t], r = 0, o = i.length; r < o; ++r)
        i[r].value.apply(n, e)
    },
  }
  var ee = nW,
    ei = 'http://www.w3.org/1999/xhtml',
    er = {
      svg: 'http://www.w3.org/2000/svg',
      xhtml: ei,
      xlink: 'http://www.w3.org/1999/xlink',
      xml: 'http://www.w3.org/XML/1998/namespace',
      xmlns: 'http://www.w3.org/2000/xmlns/',
    }
  function eo(t) {
    var n = (t += ''),
      e = n.indexOf(':')
    return (
      e >= 0 && 'xmlns' !== (n = t.slice(0, e)) && (t = t.slice(e + 1)),
      er.hasOwnProperty(n) ? { space: er[n], local: t } : t
    )
  }
  function es(t) {
    return function () {
      var n = this.ownerDocument,
        e = this.namespaceURI
      return e === ei && n.documentElement.namespaceURI === ei
        ? n.createElement(t)
        : n.createElementNS(e, t)
    }
  }
  function el(t) {
    return function () {
      return this.ownerDocument.createElementNS(t.space, t.local)
    }
  }
  function eu(t) {
    var n = eo(t)
    return (n.local ? el : es)(n)
  }
  function ea() {}
  function eh(t) {
    return null == t
      ? ea
      : function () {
          return this.querySelector(t)
        }
  }
  function ec(t) {
    'function' != typeof t && (t = eh(t))
    for (var n = this._groups, e = n.length, i = Array(e), r = 0; r < e; ++r)
      for (
        var o, s, l = n[r], u = l.length, a = (i[r] = Array(u)), h = 0;
        h < u;
        ++h
      )
        (o = l[h]) &&
          (s = t.call(o, o.__data__, h, l)) &&
          ('__data__' in o && (s.__data__ = o.__data__), (a[h] = s))
    return new iX(i, this._parents)
  }
  function ef(t) {
    return null == t ? [] : Array.isArray(t) ? t : Array.from(t)
  }
  function e_() {
    return []
  }
  function e$(t) {
    return null == t
      ? e_
      : function () {
          return this.querySelectorAll(t)
        }
  }
  function ep(t) {
    return function () {
      return ef(t.apply(this, arguments))
    }
  }
  function ed(t) {
    t = 'function' == typeof t ? ep(t) : e$(t)
    for (var n = this._groups, e = n.length, i = [], r = [], o = 0; o < e; ++o)
      for (var s, l = n[o], u = l.length, a = 0; a < u; ++a)
        (s = l[a]) && (i.push(t.call(s, s.__data__, a, l)), r.push(s))
    return new iX(i, r)
  }
  function e0(t) {
    return function () {
      return this.matches(t)
    }
  }
  function eg(t) {
    return function (n) {
      return n.matches(t)
    }
  }
  var e8 = Array.prototype.find
  function ev(t) {
    return function () {
      return e8.call(this.children, t)
    }
  }
  function ey() {
    return this.firstElementChild
  }
  function em(t) {
    return this.select(null == t ? ey : ev('function' == typeof t ? t : eg(t)))
  }
  var ex = Array.prototype.filter
  function ew() {
    return Array.from(this.children)
  }
  function e3(t) {
    return function () {
      return ex.call(this.children, t)
    }
  }
  function e2(t) {
    return this.selectAll(
      null == t ? ew : e3('function' == typeof t ? t : eg(t))
    )
  }
  function e1(t) {
    'function' != typeof t && (t = e0(t))
    for (var n = this._groups, e = n.length, i = Array(e), r = 0; r < e; ++r)
      for (var o, s = n[r], l = s.length, u = (i[r] = []), a = 0; a < l; ++a)
        (o = s[a]) && t.call(o, o.__data__, a, s) && u.push(o)
    return new iX(i, this._parents)
  }
  function e4(t) {
    return Array(t.length)
  }
  function eb() {
    return new iX(this._enter || this._groups.map(e4), this._parents)
  }
  function e5(t, n) {
    ;(this.ownerDocument = t.ownerDocument),
      (this.namespaceURI = t.namespaceURI),
      (this._next = null),
      (this._parent = t),
      (this.__data__ = n)
  }
  function e7(t) {
    return function () {
      return t
    }
  }
  function e6(t, n, e, i, r, o) {
    for (var s, l = 0, u = n.length, a = o.length; l < a; ++l)
      (s = n[l]) ? ((s.__data__ = o[l]), (i[l] = s)) : (e[l] = new e5(t, o[l]))
    for (; l < u; ++l) (s = n[l]) && (r[l] = s)
  }
  function ek(t, n, e, i, r, o, s) {
    var l,
      u,
      a,
      h = new Map(),
      c = n.length,
      f = o.length,
      _ = Array(c)
    for (l = 0; l < c; ++l)
      (u = n[l]) &&
        ((_[l] = a = s.call(u, u.__data__, l, n) + ''),
        h.has(a) ? (r[l] = u) : h.set(a, u))
    for (l = 0; l < f; ++l)
      (a = s.call(t, o[l], l, o) + ''),
        (u = h.get(a))
          ? ((i[l] = u), (u.__data__ = o[l]), h.delete(a))
          : (e[l] = new e5(t, o[l]))
    for (l = 0; l < c; ++l) (u = n[l]) && h.get(_[l]) === u && (r[l] = u)
  }
  function eS(t) {
    return t.__data__
  }
  function eP(t, n) {
    if (!arguments.length) return Array.from(this, eS)
    var e = n ? ek : e6,
      i = this._parents,
      r = this._groups
    'function' != typeof t && (t = e7(t))
    for (
      var o = r.length, s = Array(o), l = Array(o), u = Array(o), a = 0;
      a < o;
      ++a
    ) {
      var h = i[a],
        c = r[a],
        f = c.length,
        _ = eT(t.call(h, h && h.__data__, a, i)),
        $ = _.length,
        p = (l[a] = Array($)),
        d = (s[a] = Array($)),
        g = (u[a] = Array(f))
      e(h, c, p, d, g, _, n)
      for (var v, y, m = 0, x = 0; m < $; ++m)
        if ((v = p[m])) {
          for (m >= x && (x = m + 1); !(y = d[x]) && ++x < $; );
          v._next = y || null
        }
    }
    return ((s = new iX(s, i))._enter = l), (s._exit = u), s
  }
  function eT(t) {
    return 'object' == typeof t && 'length' in t ? t : Array.from(t)
  }
  function ej() {
    return new iX(this._exit || this._groups.map(e4), this._parents)
  }
  function eA(t, n, e) {
    var i = this.enter(),
      r = this,
      o = this.exit()
    return (
      'function' == typeof t
        ? (i = t(i)) && (i = i.selection())
        : (i = i.append(t + '')),
      null != n && (r = n(r)) && (r = r.selection()),
      null == e ? o.remove() : e(o),
      i && r ? i.merge(r).order() : r
    )
  }
  function eC(t) {
    for (
      var n = t.selection ? t.selection() : t,
        e = this._groups,
        i = n._groups,
        r = e.length,
        o = i.length,
        s = Math.min(r, o),
        l = Array(r),
        u = 0;
      u < s;
      ++u
    )
      for (
        var a, h = e[u], c = i[u], f = h.length, _ = (l[u] = Array(f)), $ = 0;
        $ < f;
        ++$
      )
        (a = h[$] || c[$]) && (_[$] = a)
    for (; u < r; ++u) l[u] = e[u]
    return new iX(l, this._parents)
  }
  function eq() {
    for (var t = this._groups, n = -1, e = t.length; ++n < e; )
      for (var i, r = t[n], o = r.length - 1, s = r[o]; --o >= 0; )
        (i = r[o]) &&
          (s &&
            4 ^ i.compareDocumentPosition(s) &&
            s.parentNode.insertBefore(i, s),
          (s = i))
    return this
  }
  function eI(t) {
    function n(n, e) {
      return n && e ? t(n.__data__, e.__data__) : !n - !e
    }
    t || (t = eN)
    for (var e = this._groups, i = e.length, r = Array(i), o = 0; o < i; ++o) {
      for (
        var s, l = e[o], u = l.length, a = (r[o] = Array(u)), h = 0;
        h < u;
        ++h
      )
        (s = l[h]) && (a[h] = s)
      a.sort(n)
    }
    return new iX(r, this._parents).order()
  }
  function eN(t, n) {
    return t < n ? -1 : t > n ? 1 : t >= n ? 0 : NaN
  }
  function e9() {
    var t = arguments[0]
    return (arguments[0] = this), t.apply(null, arguments), this
  }
  function ez() {
    return Array.from(this)
  }
  function eX() {
    for (var t = this._groups, n = 0, e = t.length; n < e; ++n)
      for (var i = t[n], r = 0, o = i.length; r < o; ++r) {
        var s = i[r]
        if (s) return s
      }
    return null
  }
  function eE() {
    let t = 0
    for (let n of this) ++t
    return t
  }
  function eL() {
    return !this.node()
  }
  function eO(t) {
    for (var n = this._groups, e = 0, i = n.length; e < i; ++e)
      for (var r, o = n[e], s = 0, l = o.length; s < l; ++s)
        (r = o[s]) && t.call(r, r.__data__, s, o)
    return this
  }
  function eH(t) {
    return function () {
      this.removeAttribute(t)
    }
  }
  function eR(t) {
    return function () {
      this.removeAttributeNS(t.space, t.local)
    }
  }
  function eM(t, n) {
    return function () {
      this.setAttribute(t, n)
    }
  }
  function eD(t, n) {
    return function () {
      this.setAttributeNS(t.space, t.local, n)
    }
  }
  function eY(t, n) {
    return function () {
      var e = n.apply(this, arguments)
      null == e ? this.removeAttribute(t) : this.setAttribute(t, e)
    }
  }
  function eB(t, n) {
    return function () {
      var e = n.apply(this, arguments)
      null == e
        ? this.removeAttributeNS(t.space, t.local)
        : this.setAttributeNS(t.space, t.local, e)
    }
  }
  function eK(t, n) {
    var e = eo(t)
    if (arguments.length < 2) {
      var i = this.node()
      return e.local ? i.getAttributeNS(e.space, e.local) : i.getAttribute(e)
    }
    return this.each(
      (null == n
        ? e.local
          ? eR
          : eH
        : 'function' == typeof n
          ? e.local
            ? eB
            : eY
          : e.local
            ? eD
            : eM)(e, n)
    )
  }
  function eV(t) {
    return (
      (t.ownerDocument && t.ownerDocument.defaultView) ||
      (t.document && t) ||
      t.defaultView
    )
  }
  function eF(t) {
    return function () {
      this.style.removeProperty(t)
    }
  }
  function eU(t, n, e) {
    return function () {
      this.style.setProperty(t, n, e)
    }
  }
  function eZ(t, n, e) {
    return function () {
      var i = n.apply(this, arguments)
      null == i ? this.style.removeProperty(t) : this.style.setProperty(t, i, e)
    }
  }
  function eQ(t, n, e) {
    return arguments.length > 1
      ? this.each(
          (null == n ? eF : 'function' == typeof n ? eZ : eU)(t, n, e ?? '')
        )
      : eW(this.node(), t)
  }
  function eW(t, n) {
    return (
      t.style.getPropertyValue(n) ||
      eV(t).getComputedStyle(t, null).getPropertyValue(n)
    )
  }
  function eG(t) {
    return function () {
      delete this[t]
    }
  }
  function eJ(t, n) {
    return function () {
      this[t] = n
    }
  }
  function it(t, n) {
    return function () {
      var e = n.apply(this, arguments)
      null == e ? delete this[t] : (this[t] = e)
    }
  }
  function ie(t, n) {
    return arguments.length > 1
      ? this.each((null == n ? eG : 'function' == typeof n ? it : eJ)(t, n))
      : this.node()[t]
  }
  function ii(t) {
    return t.trim().split(/^|\s+/)
  }
  function ir(t) {
    return t.classList || new io(t)
  }
  function io(t) {
    ;(this._node = t), (this._names = ii(t.getAttribute('class') || ''))
  }
  function is(t, n) {
    for (var e = ir(t), i = -1, r = n.length; ++i < r; ) e.add(n[i])
  }
  function il(t, n) {
    for (var e = ir(t), i = -1, r = n.length; ++i < r; ) e.remove(n[i])
  }
  function iu(t) {
    return function () {
      is(this, t)
    }
  }
  function ia(t) {
    return function () {
      il(this, t)
    }
  }
  function ih(t, n) {
    return function () {
      ;(n.apply(this, arguments) ? is : il)(this, t)
    }
  }
  function ic(t, n) {
    var e = ii(t + '')
    if (arguments.length < 2) {
      for (var i = ir(this.node()), r = -1, o = e.length; ++r < o; )
        if (!i.contains(e[r])) return !1
      return !0
    }
    return this.each(('function' == typeof n ? ih : n ? iu : ia)(e, n))
  }
  function i_() {
    this.textContent = ''
  }
  function i$(t) {
    return function () {
      this.textContent = t
    }
  }
  function ip(t) {
    return function () {
      var n = t.apply(this, arguments)
      this.textContent = n ?? ''
    }
  }
  function id(t) {
    return arguments.length
      ? this.each(null == t ? i_ : ('function' == typeof t ? ip : i$)(t))
      : this.node().textContent
  }
  function i0() {
    this.innerHTML = ''
  }
  function ig(t) {
    return function () {
      this.innerHTML = t
    }
  }
  function i8(t) {
    return function () {
      var n = t.apply(this, arguments)
      this.innerHTML = n ?? ''
    }
  }
  function iv(t) {
    return arguments.length
      ? this.each(null == t ? i0 : ('function' == typeof t ? i8 : ig)(t))
      : this.node().innerHTML
  }
  function iy() {
    this.nextSibling && this.parentNode.appendChild(this)
  }
  function im() {
    return this.each(iy)
  }
  function ix() {
    this.previousSibling &&
      this.parentNode.insertBefore(this, this.parentNode.firstChild)
  }
  function iw() {
    return this.each(ix)
  }
  function i3(t) {
    var n = 'function' == typeof t ? t : eu(t)
    return this.select(function () {
      return this.appendChild(n.apply(this, arguments))
    })
  }
  function i2() {
    return null
  }
  function i1(t, n) {
    var e = 'function' == typeof t ? t : eu(t),
      i = null == n ? i2 : 'function' == typeof n ? n : eh(n)
    return this.select(function () {
      return this.insertBefore(
        e.apply(this, arguments),
        i.apply(this, arguments) || null
      )
    })
  }
  function i4() {
    var t = this.parentNode
    t && t.removeChild(this)
  }
  function ib() {
    return this.each(i4)
  }
  function i5() {
    var t = this.cloneNode(!1),
      n = this.parentNode
    return n ? n.insertBefore(t, this.nextSibling) : t
  }
  function i7() {
    var t = this.cloneNode(!0),
      n = this.parentNode
    return n ? n.insertBefore(t, this.nextSibling) : t
  }
  function i6(t) {
    return this.select(t ? i7 : i5)
  }
  function ik(t) {
    return arguments.length
      ? this.property('__data__', t)
      : this.node().__data__
  }
  function iS(t) {
    return function (n) {
      t.call(this, n, this.__data__)
    }
  }
  function iP(t) {
    return t
      .trim()
      .split(/^|\s+/)
      .map(function (t) {
        var n = '',
          e = t.indexOf('.')
        return (
          e >= 0 && ((n = t.slice(e + 1)), (t = t.slice(0, e))),
          { type: t, name: n }
        )
      })
  }
  function iT(t) {
    return function () {
      var n = this.__on
      if (n) {
        for (var e, i = 0, r = -1, o = n.length; i < o; ++i)
          (e = n[i]),
            (t.type && e.type !== t.type) || e.name !== t.name
              ? (n[++r] = e)
              : this.removeEventListener(e.type, e.listener, e.options)
        ++r ? (n.length = r) : delete this.__on
      }
    }
  }
  function ij(t, n, e) {
    return function () {
      var i,
        r = this.__on,
        o = iS(n)
      if (r) {
        for (var s = 0, l = r.length; s < l; ++s)
          if ((i = r[s]).type === t.type && i.name === t.name) {
            this.removeEventListener(i.type, i.listener, i.options),
              this.addEventListener(i.type, (i.listener = o), (i.options = e)),
              (i.value = n)
            return
          }
      }
      this.addEventListener(t.type, o, e),
        (i = { type: t.type, name: t.name, value: n, listener: o, options: e }),
        r ? r.push(i) : (this.__on = [i])
    }
  }
  function iA(t, n, e) {
    var i,
      r,
      o = iP(t + ''),
      s = o.length
    if (arguments.length < 2) {
      var l = this.node().__on
      if (l) {
        for (var u, a = 0, h = l.length; a < h; ++a)
          for (i = 0, u = l[a]; i < s; ++i)
            if ((r = o[i]).type === u.type && r.name === u.name) return u.value
      }
      return
    }
    for (l = n ? ij : iT, i = 0; i < s; ++i) this.each(l(o[i], n, e))
    return this
  }
  function iC(t, n, e) {
    var i = eV(t),
      r = i.CustomEvent
    'function' == typeof r
      ? (r = new r(n, e))
      : ((r = i.document.createEvent('Event')),
        e
          ? (r.initEvent(n, e.bubbles, e.cancelable), (r.detail = e.detail))
          : r.initEvent(n, !1, !1)),
      t.dispatchEvent(r)
  }
  function iq(t, n) {
    return function () {
      return iC(this, t, n)
    }
  }
  function iI(t, n) {
    return function () {
      return iC(this, t, n.apply(this, arguments))
    }
  }
  function iN(t, n) {
    return this.each(('function' == typeof n ? iI : iq)(t, n))
  }
  function* i9() {
    for (var t = this._groups, n = 0, e = t.length; n < e; ++n)
      for (var i, r = t[n], o = 0, s = r.length; o < s; ++o)
        (i = r[o]) && (yield i)
  }
  ;(e5.prototype = {
    constructor: e5,
    appendChild: function (t) {
      return this._parent.insertBefore(t, this._next)
    },
    insertBefore: function (t, n) {
      return this._parent.insertBefore(t, n)
    },
    querySelector: function (t) {
      return this._parent.querySelector(t)
    },
    querySelectorAll: function (t) {
      return this._parent.querySelectorAll(t)
    },
  }),
    (io.prototype = {
      add: function (t) {
        0 > this._names.indexOf(t) &&
          (this._names.push(t),
          this._node.setAttribute('class', this._names.join(' ')))
      },
      remove: function (t) {
        var n = this._names.indexOf(t)
        n >= 0 &&
          (this._names.splice(n, 1),
          this._node.setAttribute('class', this._names.join(' ')))
      },
      contains: function (t) {
        return this._names.indexOf(t) >= 0
      },
    })
  var iz = [null]
  function iX(t, n) {
    ;(this._groups = t), (this._parents = n)
  }
  function iE() {
    return new iX([[document.documentElement]], iz)
  }
  function iL() {
    return this
  }
  iX.prototype = iE.prototype = {
    constructor: iX,
    select: ec,
    selectAll: ed,
    selectChild: em,
    selectChildren: e2,
    filter: e1,
    data: eP,
    enter: eb,
    exit: ej,
    join: eA,
    merge: eC,
    selection: iL,
    order: eq,
    sort: eI,
    call: e9,
    nodes: ez,
    node: eX,
    size: eE,
    empty: eL,
    each: eO,
    attr: eK,
    style: eQ,
    property: ie,
    classed: ic,
    text: id,
    html: iv,
    raise: im,
    lower: iw,
    append: i3,
    insert: i1,
    remove: ib,
    clone: i6,
    datum: ik,
    on: iA,
    dispatch: iN,
    [Symbol.iterator]: i9,
  }
  var iO = iE
  function iH(t, n, e) {
    ;(t.prototype = n.prototype = e), (e.constructor = t)
  }
  function iR(t, n) {
    var e = Object.create(t.prototype)
    for (var i in n) e[i] = n[i]
    return e
  }
  function iM() {}
  var iD = 0.7,
    iY = 1 / iD,
    iB = '\\s*([+-]?\\d+)\\s*',
    iK = '\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*',
    iV = '\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*',
    iF = /^#([0-9a-f]{3,8})$/,
    iU = RegExp('^rgb\\(' + [iB, iB, iB] + '\\)$'),
    iZ = RegExp('^rgb\\(' + [iV, iV, iV] + '\\)$'),
    iQ = RegExp('^rgba\\(' + [iB, iB, iB, iK] + '\\)$'),
    iW = RegExp('^rgba\\(' + [iV, iV, iV, iK] + '\\)$'),
    iG = RegExp('^hsl\\(' + [iK, iV, iV] + '\\)$'),
    iJ = RegExp('^hsla\\(' + [iK, iV, iV, iK] + '\\)$'),
    rt = {
      aliceblue: 15792383,
      antiquewhite: 16444375,
      aqua: 65535,
      aquamarine: 8388564,
      azure: 15794175,
      beige: 16119260,
      bisque: 16770244,
      black: 0,
      blanchedalmond: 16772045,
      blue: 255,
      blueviolet: 9055202,
      brown: 10824234,
      burlywood: 14596231,
      cadetblue: 6266528,
      chartreuse: 8388352,
      chocolate: 13789470,
      coral: 16744272,
      cornflowerblue: 6591981,
      cornsilk: 16775388,
      crimson: 14423100,
      cyan: 65535,
      darkblue: 139,
      darkcyan: 35723,
      darkgoldenrod: 12092939,
      darkgray: 11119017,
      darkgreen: 25600,
      darkgrey: 11119017,
      darkkhaki: 12433259,
      darkmagenta: 9109643,
      darkolivegreen: 5597999,
      darkorange: 16747520,
      darkorchid: 10040012,
      darkred: 9109504,
      darksalmon: 15308410,
      darkseagreen: 9419919,
      darkslateblue: 4734347,
      darkslategray: 3100495,
      darkslategrey: 3100495,
      darkturquoise: 52945,
      darkviolet: 9699539,
      deeppink: 16716947,
      deepskyblue: 49151,
      dimgray: 6908265,
      dimgrey: 6908265,
      dodgerblue: 2003199,
      firebrick: 11674146,
      floralwhite: 16775920,
      forestgreen: 2263842,
      fuchsia: 16711935,
      gainsboro: 14474460,
      ghostwhite: 16316671,
      gold: 16766720,
      goldenrod: 14329120,
      gray: 8421504,
      green: 32768,
      greenyellow: 11403055,
      grey: 8421504,
      honeydew: 15794160,
      hotpink: 16738740,
      indianred: 13458524,
      indigo: 4915330,
      ivory: 16777200,
      khaki: 15787660,
      lavender: 15132410,
      lavenderblush: 16773365,
      lawngreen: 8190976,
      lemonchiffon: 16775885,
      lightblue: 11393254,
      lightcoral: 15761536,
      lightcyan: 14745599,
      lightgoldenrodyellow: 16448210,
      lightgray: 13882323,
      lightgreen: 9498256,
      lightgrey: 13882323,
      lightpink: 16758465,
      lightsalmon: 16752762,
      lightseagreen: 2142890,
      lightskyblue: 8900346,
      lightslategray: 7833753,
      lightslategrey: 7833753,
      lightsteelblue: 11584734,
      lightyellow: 16777184,
      lime: 65280,
      limegreen: 3329330,
      linen: 16445670,
      magenta: 16711935,
      maroon: 8388608,
      mediumaquamarine: 6737322,
      mediumblue: 205,
      mediumorchid: 12211667,
      mediumpurple: 9662683,
      mediumseagreen: 3978097,
      mediumslateblue: 8087790,
      mediumspringgreen: 64154,
      mediumturquoise: 4772300,
      mediumvioletred: 13047173,
      midnightblue: 1644912,
      mintcream: 16121850,
      mistyrose: 16770273,
      moccasin: 16770229,
      navajowhite: 16768685,
      navy: 128,
      oldlace: 16643558,
      olive: 8421376,
      olivedrab: 7048739,
      orange: 16753920,
      orangered: 16729344,
      orchid: 14315734,
      palegoldenrod: 15657130,
      palegreen: 10025880,
      paleturquoise: 11529966,
      palevioletred: 14381203,
      papayawhip: 16773077,
      peachpuff: 16767673,
      peru: 13468991,
      pink: 16761035,
      plum: 14524637,
      powderblue: 11591910,
      purple: 8388736,
      rebeccapurple: 6697881,
      red: 16711680,
      rosybrown: 12357519,
      royalblue: 4286945,
      saddlebrown: 9127187,
      salmon: 16416882,
      sandybrown: 16032864,
      seagreen: 3050327,
      seashell: 16774638,
      sienna: 10506797,
      silver: 12632256,
      skyblue: 8900331,
      slateblue: 6970061,
      slategray: 7372944,
      slategrey: 7372944,
      snow: 16775930,
      springgreen: 65407,
      steelblue: 4620980,
      tan: 13808780,
      teal: 32896,
      thistle: 14204888,
      tomato: 16737095,
      turquoise: 4251856,
      violet: 15631086,
      wheat: 16113331,
      white: 16777215,
      whitesmoke: 16119285,
      yellow: 16776960,
      yellowgreen: 10145074,
    }
  function rn() {
    return this.rgb().formatHex()
  }
  function re() {
    return r$(this).formatHsl()
  }
  function ri() {
    return this.rgb().formatRgb()
  }
  function rr(t) {
    var n, e
    return (
      (t = (t + '').trim().toLowerCase()),
      (n = iF.exec(t))
        ? ((e = n[1].length),
          (n = parseInt(n[1], 16)),
          6 === e
            ? ro(n)
            : 3 === e
              ? new ra(
                  ((n >> 8) & 15) | ((n >> 4) & 240),
                  ((n >> 4) & 15) | (240 & n),
                  ((15 & n) << 4) | (15 & n),
                  1
                )
              : 8 === e
                ? rs(
                    (n >> 24) & 255,
                    (n >> 16) & 255,
                    (n >> 8) & 255,
                    (255 & n) / 255
                  )
                : 4 === e
                  ? rs(
                      ((n >> 12) & 15) | ((n >> 8) & 240),
                      ((n >> 8) & 15) | ((n >> 4) & 240),
                      ((n >> 4) & 15) | (240 & n),
                      (((15 & n) << 4) | (15 & n)) / 255
                    )
                  : null)
        : (n = iU.exec(t))
          ? new ra(n[1], n[2], n[3], 1)
          : (n = iZ.exec(t))
            ? new ra(
                (255 * n[1]) / 100,
                (255 * n[2]) / 100,
                (255 * n[3]) / 100,
                1
              )
            : (n = iQ.exec(t))
              ? rs(n[1], n[2], n[3], n[4])
              : (n = iW.exec(t))
                ? rs(
                    (255 * n[1]) / 100,
                    (255 * n[2]) / 100,
                    (255 * n[3]) / 100,
                    n[4]
                  )
                : (n = iG.exec(t))
                  ? r_(n[1], n[2] / 100, n[3] / 100, 1)
                  : (n = iJ.exec(t))
                    ? r_(n[1], n[2] / 100, n[3] / 100, n[4])
                    : rt.hasOwnProperty(t)
                      ? ro(rt[t])
                      : 'transparent' === t
                        ? new ra(NaN, NaN, NaN, 0)
                        : null
    )
  }
  function ro(t) {
    return new ra((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1)
  }
  function rs(t, n, e, i) {
    return i <= 0 && (t = n = e = NaN), new ra(t, n, e, i)
  }
  function rl(t) {
    return (
      t instanceof iM || (t = rr(t)),
      t ? ((t = t.rgb()), new ra(t.r, t.g, t.b, t.opacity)) : new ra()
    )
  }
  function ru(t, n, e, i) {
    return 1 === arguments.length ? rl(t) : new ra(t, n, e, i ?? 1)
  }
  function ra(t, n, e, i) {
    ;(this.r = +t), (this.g = +n), (this.b = +e), (this.opacity = +i)
  }
  function rh() {
    return '#' + rf(this.r) + rf(this.g) + rf(this.b)
  }
  function rc() {
    var t = this.opacity
    return (
      (1 === (t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t)))
        ? 'rgb('
        : 'rgba(') +
      Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
      ', ' +
      Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
      ', ' +
      Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
      (1 === t ? ')' : ', ' + t + ')')
    )
  }
  function rf(t) {
    return (
      ((t = Math.max(0, Math.min(255, Math.round(t) || 0))) < 16 ? '0' : '') +
      t.toString(16)
    )
  }
  function r_(t, n, e, i) {
    return (
      i <= 0
        ? (t = n = e = NaN)
        : e <= 0 || e >= 1
          ? (t = n = NaN)
          : n <= 0 && (t = NaN),
      new rd(t, n, e, i)
    )
  }
  function r$(t) {
    if (t instanceof rd) return new rd(t.h, t.s, t.l, t.opacity)
    if ((t instanceof iM || (t = rr(t)), !t)) return new rd()
    if (t instanceof rd) return t
    var n = (t = t.rgb()).r / 255,
      e = t.g / 255,
      i = t.b / 255,
      r = Math.min(n, e, i),
      o = Math.max(n, e, i),
      s = NaN,
      l = o - r,
      u = (o + r) / 2
    return (
      l
        ? ((s =
            n === o
              ? (e - i) / l + (e < i) * 6
              : e === o
                ? (i - n) / l + 2
                : (n - e) / l + 4),
          (l /= u < 0.5 ? o + r : 2 - o - r),
          (s *= 60))
        : (l = u > 0 && u < 1 ? 0 : s),
      new rd(s, l, u, t.opacity)
    )
  }
  function rp(t, n, e, i) {
    return 1 === arguments.length ? r$(t) : new rd(t, n, e, i ?? 1)
  }
  function rd(t, n, e, i) {
    ;(this.h = +t), (this.s = +n), (this.l = +e), (this.opacity = +i)
  }
  function r0(t, n, e) {
    return (
      (t < 60
        ? n + ((e - n) * t) / 60
        : t < 180
          ? e
          : t < 240
            ? n + ((e - n) * (240 - t)) / 60
            : n) * 255
    )
  }
  function rg(t, n, e, i, r) {
    var o = t * t,
      s = o * t
    return (
      ((1 - 3 * t + 3 * o - s) * n +
        (4 - 6 * o + 3 * s) * e +
        (1 + 3 * t + 3 * o - 3 * s) * i +
        s * r) /
      6
    )
  }
  function r8(t) {
    var n = t.length - 1
    return function (e) {
      var i = e <= 0 ? (e = 0) : e >= 1 ? ((e = 1), n - 1) : Math.floor(e * n),
        r = t[i],
        o = t[i + 1],
        s = i > 0 ? t[i - 1] : 2 * r - o,
        l = i < n - 1 ? t[i + 2] : 2 * o - r
      return rg((e - i / n) * n, s, r, o, l)
    }
  }
  function rv(t) {
    var n = t.length
    return function (e) {
      var i = Math.floor(((e %= 1) < 0 ? ++e : e) * n),
        r = t[(i + n - 1) % n],
        o = t[i % n],
        s = t[(i + 1) % n],
        l = t[(i + 2) % n]
      return rg((e - i / n) * n, r, o, s, l)
    }
  }
  iH(iM, rr, {
    copy: function (t) {
      return Object.assign(new this.constructor(), this, t)
    },
    displayable: function () {
      return this.rgb().displayable()
    },
    hex: rn,
    formatHex: rn,
    formatHsl: re,
    formatRgb: ri,
    toString: ri,
  }),
    iH(
      ra,
      ru,
      iR(iM, {
        brighter: function (t) {
          return (
            (t = null == t ? iY : Math.pow(iY, t)),
            new ra(this.r * t, this.g * t, this.b * t, this.opacity)
          )
        },
        darker: function (t) {
          return (
            (t = null == t ? iD : Math.pow(iD, t)),
            new ra(this.r * t, this.g * t, this.b * t, this.opacity)
          )
        },
        rgb: function () {
          return this
        },
        displayable: function () {
          return (
            -0.5 <= this.r &&
            this.r < 255.5 &&
            -0.5 <= this.g &&
            this.g < 255.5 &&
            -0.5 <= this.b &&
            this.b < 255.5 &&
            0 <= this.opacity &&
            this.opacity <= 1
          )
        },
        hex: rh,
        formatHex: rh,
        formatRgb: rc,
        toString: rc,
      })
    ),
    iH(
      rd,
      rp,
      iR(iM, {
        brighter: function (t) {
          return (
            (t = null == t ? iY : Math.pow(iY, t)),
            new rd(this.h, this.s, this.l * t, this.opacity)
          )
        },
        darker: function (t) {
          return (
            (t = null == t ? iD : Math.pow(iD, t)),
            new rd(this.h, this.s, this.l * t, this.opacity)
          )
        },
        rgb: function () {
          var t = (this.h % 360) + (this.h < 0) * 360,
            n = isNaN(t) || isNaN(this.s) ? 0 : this.s,
            e = this.l,
            i = e + (e < 0.5 ? e : 1 - e) * n,
            r = 2 * e - i
          return new ra(
            r0(t >= 240 ? t - 240 : t + 120, r, i),
            r0(t, r, i),
            r0(t < 120 ? t + 240 : t - 120, r, i),
            this.opacity
          )
        },
        displayable: function () {
          return (
            ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
            0 <= this.l &&
            this.l <= 1 &&
            0 <= this.opacity &&
            this.opacity <= 1
          )
        },
        formatHsl: function () {
          var t = this.opacity
          return (
            (1 === (t = isNaN(t) ? 1 : Math.max(0, Math.min(1, t)))
              ? 'hsl('
              : 'hsla(') +
            (this.h || 0) +
            ', ' +
            100 * (this.s || 0) +
            '%, ' +
            100 * (this.l || 0) +
            '%' +
            (1 === t ? ')' : ', ' + t + ')')
          )
        },
      })
    )
  var ry = (t) => () => t
  function rm(t, n) {
    return function (e) {
      return t + e * n
    }
  }
  function rx(t, n, e) {
    return (
      (n = Math.pow(n, e) - (t = Math.pow(t, e))),
      (e = 1 / e),
      function (i) {
        return Math.pow(t + i * n, e)
      }
    )
  }
  function rw(t) {
    return 1 == (t = +t)
      ? r3
      : function (n, e) {
          return e - n ? rx(n, e, t) : ry(isNaN(n) ? e : n)
        }
  }
  function r3(t, n) {
    var e = n - t
    return e ? rm(t, e) : ry(isNaN(t) ? n : t)
  }
  var r2 = (function t(n) {
    var e = rw(1)
    function i(t, n) {
      var i = e((t = ru(t)).r, (n = ru(n)).r),
        r = e(t.g, n.g),
        o = e(t.b, n.b),
        s = r3(t.opacity, n.opacity)
      return function (n) {
        return (
          (t.r = i(n)), (t.g = r(n)), (t.b = o(n)), (t.opacity = s(n)), t + ''
        )
      }
    }
    return (i.gamma = t), i
  })(1)
  function r1(t) {
    return function (n) {
      var e,
        i,
        r = n.length,
        o = Array(r),
        s = Array(r),
        l = Array(r)
      for (e = 0; e < r; ++e)
        (i = ru(n[e])), (o[e] = i.r || 0), (s[e] = i.g || 0), (l[e] = i.b || 0)
      return (
        (o = t(o)),
        (s = t(s)),
        (l = t(l)),
        (i.opacity = 1),
        function (t) {
          return (i.r = o(t)), (i.g = s(t)), (i.b = l(t)), i + ''
        }
      )
    }
  }
  var r4 = r1(r8),
    rb = r1(rv)
  function r5(t, n) {
    return (
      (t = +t),
      (n = +n),
      function (e) {
        return t * (1 - e) + n * e
      }
    )
  }
  var r7 = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    r6 = RegExp(r7.source, 'g')
  function rk(t) {
    return function () {
      return t
    }
  }
  function rS(t) {
    return function (n) {
      return t(n) + ''
    }
  }
  function rP(t, n) {
    var e,
      i,
      r,
      o = (r7.lastIndex = r6.lastIndex = 0),
      s = -1,
      l = [],
      u = []
    for (t += '', n += ''; (e = r7.exec(t)) && (i = r6.exec(n)); )
      (r = i.index) > o &&
        ((r = n.slice(o, r)), l[s] ? (l[s] += r) : (l[++s] = r)),
        (e = e[0]) === (i = i[0])
          ? l[s]
            ? (l[s] += i)
            : (l[++s] = i)
          : ((l[++s] = null), u.push({ i: s, x: r5(e, i) })),
        (o = r6.lastIndex)
    return (
      o < n.length && ((r = n.slice(o)), l[s] ? (l[s] += r) : (l[++s] = r)),
      l.length < 2
        ? u[0]
          ? rS(u[0].x)
          : rk(n)
        : ((n = u.length),
          function (t) {
            for (var e, i = 0; i < n; ++i) l[(e = u[i]).i] = e.x(t)
            return l.join('')
          })
    )
  }
  var rT = 180 / Math.PI,
    rj = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1,
    }
  function rA(t, n, e, i, r, o) {
    var s, l, u
    return (
      (s = Math.sqrt(t * t + n * n)) && ((t /= s), (n /= s)),
      (u = t * e + n * i) && ((e -= t * u), (i -= n * u)),
      (l = Math.sqrt(e * e + i * i)) && ((e /= l), (i /= l), (u /= l)),
      t * i < n * e && ((t = -t), (n = -n), (u = -u), (s = -s)),
      {
        translateX: r,
        translateY: o,
        rotate: Math.atan2(n, t) * rT,
        skewX: Math.atan(u) * rT,
        scaleX: s,
        scaleY: l,
      }
    )
  }
  function rC(t) {
    let n = new ('function' == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(
      t + ''
    )
    return n.isIdentity ? rj : rA(n.a, n.b, n.c, n.d, n.e, n.f)
  }
  function rq(n) {
    return null == n
      ? rj
      : (t || (t = document.createElementNS('http://www.w3.org/2000/svg', 'g')),
        t.setAttribute('transform', n),
        (n = t.transform.baseVal.consolidate())
          ? rA((n = n.matrix).a, n.b, n.c, n.d, n.e, n.f)
          : rj)
  }
  function rI(t, n, e, i) {
    function r(t) {
      return t.length ? t.pop() + ' ' : ''
    }
    return function (o, s) {
      var l,
        u,
        a,
        h,
        c,
        f,
        _,
        $,
        p = [],
        d = []
      return (
        (o = t(o)),
        (s = t(s)),
        (function t(i, r, o, s, l, u) {
          if (i !== o || r !== s) {
            var a = l.push('translate(', null, n, null, e)
            u.push({ i: a - 4, x: r5(i, o) }, { i: a - 2, x: r5(r, s) })
          } else (o || s) && l.push('translate(' + o + n + s + e)
        })(o.translateX, o.translateY, s.translateX, s.translateY, p, d),
        (l = o.rotate),
        (u = s.rotate),
        (a = p),
        (h = d),
        l !== u
          ? (l - u > 180 ? (u += 360) : u - l > 180 && (l += 360),
            h.push({ i: a.push(r(a) + 'rotate(', null, i) - 2, x: r5(l, u) }))
          : u && a.push(r(a) + 'rotate(' + u + i),
        (c = o.skewX),
        (f = s.skewX),
        (_ = p),
        ($ = d),
        c !== f
          ? $.push({ i: _.push(r(_) + 'skewX(', null, i) - 2, x: r5(c, f) })
          : f && _.push(r(_) + 'skewX(' + f + i),
        (function t(n, e, i, o, s, l) {
          if (n !== i || e !== o) {
            var u = s.push(r(s) + 'scale(', null, ',', null, ')')
            l.push({ i: u - 4, x: r5(n, i) }, { i: u - 2, x: r5(e, o) })
          } else
            (1 !== i || 1 !== o) && s.push(r(s) + 'scale(' + i + ',' + o + ')')
        })(o.scaleX, o.scaleY, s.scaleX, s.scaleY, p, d),
        (o = s = null),
        function (t) {
          for (var n, e = -1, i = d.length; ++e < i; ) p[(n = d[e]).i] = n.x(t)
          return p.join('')
        }
      )
    }
  }
  var rN = rI(rC, 'px, ', 'px)', 'deg)'),
    r9 = rI(rq, ', ', ')', ')'),
    rz = 0,
    rX = 0,
    rE = 0,
    rL = 1e3,
    rO = 0,
    rH = 0,
    rR = 0,
    rM = 'object' == typeof performance && performance.now ? performance : Date,
    rD =
      'object' == typeof window && window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : function (t) {
            setTimeout(t, 17)
          }
  function rY() {
    return rH || (rD(rB), (rH = rM.now() + rR))
  }
  function rB() {
    rH = 0
  }
  function rK() {
    this._call = this._time = this._next = null
  }
  function rV(t, n, e) {
    var i = new rK()
    return i.restart(t, n, e), i
  }
  function rF() {
    rY(), ++rz
    for (var t, e = n; e; )
      (t = rH - e._time) >= 0 && e._call.call(void 0, t), (e = e._next)
    --rz
  }
  function rU() {
    ;(rH = (rO = rM.now()) + rR), (rz = rX = 0)
    try {
      rF()
    } finally {
      ;(rz = 0), rQ(), (rH = 0)
    }
  }
  function rZ() {
    var t = rM.now(),
      n = t - rO
    n > rL && ((rR -= n), (rO = t))
  }
  function rQ() {
    for (var t, i, r = n, o = 1 / 0; r; )
      r._call
        ? (o > r._time && (o = r._time), (t = r), (r = r._next))
        : ((i = r._next), (r._next = null), (r = t ? (t._next = i) : (n = i)))
    ;(e = t), rW(o)
  }
  function rW(t) {
    !rz &&
      (rX && (rX = clearTimeout(rX)),
      t - rH > 24
        ? (t < 1 / 0 && (rX = setTimeout(rU, t - rM.now() - rR)),
          rE && (rE = clearInterval(rE)))
        : (rE || ((rO = rM.now()), (rE = setInterval(rZ, rL))),
          (rz = 1),
          rD(rU)))
  }
  function rG(t, n, e) {
    var i = new rK()
    return (
      (n = null == n ? 0 : +n),
      i.restart(
        (e) => {
          i.stop(), t(e + n)
        },
        n,
        e
      ),
      i
    )
  }
  rK.prototype = rV.prototype = {
    constructor: rK,
    restart: function (t, i, r) {
      if ('function' != typeof t) throw TypeError('callback is not a function')
      ;(r = (null == r ? rY() : +r) + (null == i ? 0 : +i)),
        this._next ||
          e === this ||
          (e ? (e._next = this) : (n = this), (e = this)),
        (this._call = t),
        (this._time = r),
        rW()
    },
    stop: function () {
      this._call && ((this._call = null), (this._time = 1 / 0), rW())
    },
  }
  var rJ = ee('start', 'end', 'cancel', 'interrupt'),
    ot = [],
    on = 0,
    oe = 1,
    oi = 2,
    or = 3,
    oo = 4,
    os = 5,
    ol = 6
  function ou(t, n, e, i, r, o) {
    var s = t.__transition
    if (s) {
      if (e in s) return
    } else t.__transition = {}
    of(t, e, {
      name: n,
      index: i,
      group: r,
      on: rJ,
      tween: ot,
      time: o.time,
      delay: o.delay,
      duration: o.duration,
      ease: o.ease,
      timer: null,
      state: on,
    })
  }
  function oa(t, n) {
    var e = oc(t, n)
    if (e.state > on) throw Error('too late; already scheduled')
    return e
  }
  function oh(t, n) {
    var e = oc(t, n)
    if (e.state > or) throw Error('too late; already running')
    return e
  }
  function oc(t, n) {
    var e = t.__transition
    if (!e || !(e = e[n])) throw Error('transition not found')
    return e
  }
  function of(t, n, e) {
    var i,
      r = t.__transition
    function o(u) {
      var a, h, c, f
      if (e.state !== oe) return l()
      for (a in r)
        if ((f = r[a]).name === e.name) {
          if (f.state === or) return rG(o)
          f.state === oo
            ? ((f.state = ol),
              f.timer.stop(),
              f.on.call('interrupt', t, t.__data__, f.index, f.group),
              delete r[a])
            : +a < n &&
              ((f.state = ol),
              f.timer.stop(),
              f.on.call('cancel', t, t.__data__, f.index, f.group),
              delete r[a])
        }
      if (
        (rG(function () {
          e.state === or &&
            ((e.state = oo), e.timer.restart(s, e.delay, e.time), s(u))
        }),
        (e.state = oi),
        e.on.call('start', t, t.__data__, e.index, e.group),
        e.state === oi)
      ) {
        for (
          e.state = or, i = Array((c = e.tween.length)), a = 0, h = -1;
          a < c;
          ++a
        )
          (f = e.tween[a].value.call(t, t.__data__, e.index, e.group)) &&
            (i[++h] = f)
        i.length = h + 1
      }
    }
    function s(n) {
      for (
        var r =
            n < e.duration
              ? e.ease.call(null, n / e.duration)
              : (e.timer.restart(l), (e.state = os), 1),
          o = -1,
          s = i.length;
        ++o < s;

      )
        i[o].call(t, r)
      e.state === os && (e.on.call('end', t, t.__data__, e.index, e.group), l())
    }
    function l() {
      for (var i in ((e.state = ol), e.timer.stop(), delete r[n], r)) return
      delete t.__transition
    }
    ;(r[n] = e),
      (e.timer = rV(
        function t(n) {
          ;(e.state = oe),
            e.timer.restart(o, e.delay, e.time),
            e.delay <= n && o(n - e.delay)
        },
        0,
        e.time
      ))
  }
  function o_(t, n) {
    var e,
      i,
      r,
      o = t.__transition,
      s = !0
    if (o) {
      for (r in ((n = null == n ? null : n + ''), o)) {
        if ((e = o[r]).name !== n) {
          s = !1
          continue
        }
        ;(i = e.state > oi && e.state < os),
          (e.state = ol),
          e.timer.stop(),
          e.on.call(
            i ? 'interrupt' : 'cancel',
            t,
            t.__data__,
            e.index,
            e.group
          ),
          delete o[r]
      }
      s && delete t.__transition
    }
  }
  function o$(t) {
    return this.each(function () {
      o_(this, t)
    })
  }
  function op(t, n) {
    var e, i
    return function () {
      var r = oh(this, t),
        o = r.tween
      if (o !== e) {
        i = e = o
        for (var s = 0, l = i.length; s < l; ++s)
          if (i[s].name === n) {
            ;(i = i.slice()).splice(s, 1)
            break
          }
      }
      r.tween = i
    }
  }
  function od(t, n, e) {
    var i, r
    if ('function' != typeof e) throw Error()
    return function () {
      var o = oh(this, t),
        s = o.tween
      if (s !== i) {
        r = (i = s).slice()
        for (var l = { name: n, value: e }, u = 0, a = r.length; u < a; ++u)
          if (r[u].name === n) {
            r[u] = l
            break
          }
        u === a && r.push(l)
      }
      o.tween = r
    }
  }
  function o0(t, n) {
    var e = this._id
    if (((t += ''), arguments.length < 2)) {
      for (var i, r = oc(this.node(), e).tween, o = 0, s = r.length; o < s; ++o)
        if ((i = r[o]).name === t) return i.value
      return null
    }
    return this.each((null == n ? op : od)(e, t, n))
  }
  function og(t, n, e) {
    var i = t._id
    return (
      t.each(function () {
        var t = oh(this, i)
        ;(t.value || (t.value = {}))[n] = e.apply(this, arguments)
      }),
      function (t) {
        return oc(t, i).value[n]
      }
    )
  }
  function o8(t, n) {
    var e
    return (
      'number' == typeof n
        ? r5
        : n instanceof rr
          ? r2
          : (e = rr(n))
            ? ((n = e), r2)
            : rP
    )(t, n)
  }
  function ov(t) {
    return function () {
      this.removeAttribute(t)
    }
  }
  function oy(t) {
    return function () {
      this.removeAttributeNS(t.space, t.local)
    }
  }
  function om(t, n, e) {
    var i,
      r,
      o = e + ''
    return function () {
      var s = this.getAttribute(t)
      return s === o ? null : s === i ? r : (r = n((i = s), e))
    }
  }
  function ox(t, n, e) {
    var i,
      r,
      o = e + ''
    return function () {
      var s = this.getAttributeNS(t.space, t.local)
      return s === o ? null : s === i ? r : (r = n((i = s), e))
    }
  }
  function ow(t, n, e) {
    var i, r, o
    return function () {
      var s,
        l,
        u = e(this)
      return null == u
        ? void this.removeAttribute(t)
        : (s = this.getAttribute(t)) === (l = u + '')
          ? null
          : s === i && l === r
            ? o
            : ((r = l), (o = n((i = s), u)))
    }
  }
  function o3(t, n, e) {
    var i, r, o
    return function () {
      var s,
        l,
        u = e(this)
      return null == u
        ? void this.removeAttributeNS(t.space, t.local)
        : (s = this.getAttributeNS(t.space, t.local)) === (l = u + '')
          ? null
          : s === i && l === r
            ? o
            : ((r = l), (o = n((i = s), u)))
    }
  }
  function o2(t, n) {
    var e = eo(t),
      i = 'transform' === e ? r9 : o8
    return this.attrTween(
      t,
      'function' == typeof n
        ? (e.local ? o3 : ow)(e, i, og(this, 'attr.' + t, n))
        : null == n
          ? (e.local ? oy : ov)(e)
          : (e.local ? ox : om)(e, i, n)
    )
  }
  function o1(t, n) {
    return function (e) {
      this.setAttribute(t, n.call(this, e))
    }
  }
  function o4(t, n) {
    return function (e) {
      this.setAttributeNS(t.space, t.local, n.call(this, e))
    }
  }
  function ob(t, n) {
    var e, i
    function r() {
      var r = n.apply(this, arguments)
      return r !== i && (e = (i = r) && o4(t, r)), e
    }
    return (r._value = n), r
  }
  function o5(t, n) {
    var e, i
    function r() {
      var r = n.apply(this, arguments)
      return r !== i && (e = (i = r) && o1(t, r)), e
    }
    return (r._value = n), r
  }
  function o7(t, n) {
    var e = 'attr.' + t
    if (arguments.length < 2) return (e = this.tween(e)) && e._value
    if (null == n) return this.tween(e, null)
    if ('function' != typeof n) throw Error()
    var i = eo(t)
    return this.tween(e, (i.local ? ob : o5)(i, n))
  }
  function o6(t, n) {
    return function () {
      oa(this, t).delay = +n.apply(this, arguments)
    }
  }
  function ok(t, n) {
    return (
      (n = +n),
      function () {
        oa(this, t).delay = n
      }
    )
  }
  function oS(t) {
    var n = this._id
    return arguments.length
      ? this.each(('function' == typeof t ? o6 : ok)(n, t))
      : oc(this.node(), n).delay
  }
  function oP(t, n) {
    return function () {
      oh(this, t).duration = +n.apply(this, arguments)
    }
  }
  function oT(t, n) {
    return (
      (n = +n),
      function () {
        oh(this, t).duration = n
      }
    )
  }
  function oj(t) {
    var n = this._id
    return arguments.length
      ? this.each(('function' == typeof t ? oP : oT)(n, t))
      : oc(this.node(), n).duration
  }
  function oA(t, n) {
    if ('function' != typeof n) throw Error()
    return function () {
      oh(this, t).ease = n
    }
  }
  function oC(t) {
    var n = this._id
    return arguments.length ? this.each(oA(n, t)) : oc(this.node(), n).ease
  }
  function oq(t, n) {
    return function () {
      var e = n.apply(this, arguments)
      if ('function' != typeof e) throw Error()
      oh(this, t).ease = e
    }
  }
  function oI(t) {
    if ('function' != typeof t) throw Error()
    return this.each(oq(this._id, t))
  }
  function oN(t) {
    'function' != typeof t && (t = e0(t))
    for (var n = this._groups, e = n.length, i = Array(e), r = 0; r < e; ++r)
      for (var o, s = n[r], l = s.length, u = (i[r] = []), a = 0; a < l; ++a)
        (o = s[a]) && t.call(o, o.__data__, a, s) && u.push(o)
    return new sl(i, this._parents, this._name, this._id)
  }
  function o9(t) {
    if (t._id !== this._id) throw Error()
    for (
      var n = this._groups,
        e = t._groups,
        i = n.length,
        r = e.length,
        o = Math.min(i, r),
        s = Array(i),
        l = 0;
      l < o;
      ++l
    )
      for (
        var u, a = n[l], h = e[l], c = a.length, f = (s[l] = Array(c)), _ = 0;
        _ < c;
        ++_
      )
        (u = a[_] || h[_]) && (f[_] = u)
    for (; l < i; ++l) s[l] = n[l]
    return new sl(s, this._parents, this._name, this._id)
  }
  function oz(t) {
    return (t + '')
      .trim()
      .split(/^|\s+/)
      .every(function (t) {
        var n = t.indexOf('.')
        return n >= 0 && (t = t.slice(0, n)), !t || 'start' === t
      })
  }
  function oX(t, n, e) {
    var i,
      r,
      o = oz(n) ? oa : oh
    return function () {
      var s = o(this, t),
        l = s.on
      l !== i && (r = (i = l).copy()).on(n, e), (s.on = r)
    }
  }
  function oE(t, n) {
    var e = this._id
    return arguments.length < 2
      ? oc(this.node(), e).on.on(t)
      : this.each(oX(e, t, n))
  }
  function oL(t) {
    return function () {
      var n = this.parentNode
      for (var e in this.__transition) if (+e !== t) return
      n && n.removeChild(this)
    }
  }
  function oO() {
    return this.on('end.remove', oL(this._id))
  }
  function oH(t) {
    var n = this._name,
      e = this._id
    'function' != typeof t && (t = eh(t))
    for (var i = this._groups, r = i.length, o = Array(r), s = 0; s < r; ++s)
      for (
        var l, u, a = i[s], h = a.length, c = (o[s] = Array(h)), f = 0;
        f < h;
        ++f
      )
        (l = a[f]) &&
          (u = t.call(l, l.__data__, f, a)) &&
          ('__data__' in l && (u.__data__ = l.__data__),
          (c[f] = u),
          ou(c[f], n, e, f, c, oc(l, e)))
    return new sl(o, this._parents, n, e)
  }
  function oR(t) {
    var n = this._name,
      e = this._id
    'function' != typeof t && (t = e$(t))
    for (var i = this._groups, r = i.length, o = [], s = [], l = 0; l < r; ++l)
      for (var u, a = i[l], h = a.length, c = 0; c < h; ++c)
        if ((u = a[c])) {
          for (
            var f,
              _ = t.call(u, u.__data__, c, a),
              $ = oc(u, e),
              p = 0,
              d = _.length;
            p < d;
            ++p
          )
            (f = _[p]) && ou(f, n, e, p, _, $)
          o.push(_), s.push(u)
        }
    return new sl(o, s, n, e)
  }
  var oM = iO.prototype.constructor
  function oD() {
    return new oM(this._groups, this._parents)
  }
  function oY(t, n) {
    var e, i, r
    return function () {
      var o = eW(this, t),
        s = (this.style.removeProperty(t), eW(this, t))
      return o === s ? null : o === e && s === i ? r : (r = n((e = o), (i = s)))
    }
  }
  function oB(t) {
    return function () {
      this.style.removeProperty(t)
    }
  }
  function oK(t, n, e) {
    var i,
      r,
      o = e + ''
    return function () {
      var s = eW(this, t)
      return s === o ? null : s === i ? r : (r = n((i = s), e))
    }
  }
  function oV(t, n, e) {
    var i, r, o
    return function () {
      var s = eW(this, t),
        l = e(this),
        u = l + ''
      return (
        null == l && (u = l = (this.style.removeProperty(t), eW(this, t))),
        s === u ? null : s === i && u === r ? o : ((r = u), (o = n((i = s), l)))
      )
    }
  }
  function oF(t, n) {
    var e,
      i,
      r,
      o,
      s = 'style.' + n,
      l = 'end.' + s
    return function () {
      var u = oh(this, t),
        a = u.on,
        h = null == u.value[s] ? o || (o = oB(n)) : void 0
      ;(a !== e || r !== h) && (i = (e = a).copy()).on(l, (r = h)), (u.on = i)
    }
  }
  function oU(t, n, e) {
    var i = 'transform' == (t += '') ? rN : o8
    return null == n
      ? this.styleTween(t, oY(t, i)).on('end.style.' + t, oB(t))
      : 'function' == typeof n
        ? this.styleTween(t, oV(t, i, og(this, 'style.' + t, n))).each(
            oF(this._id, t)
          )
        : this.styleTween(t, oK(t, i, n), e).on('end.style.' + t, null)
  }
  function oZ(t, n, e) {
    return function (i) {
      this.style.setProperty(t, n.call(this, i), e)
    }
  }
  function oQ(t, n, e) {
    var i, r
    function o() {
      var o = n.apply(this, arguments)
      return o !== r && (i = (r = o) && oZ(t, o, e)), i
    }
    return (o._value = n), o
  }
  function oW(t, n, e) {
    var i = 'style.' + (t += '')
    if (arguments.length < 2) return (i = this.tween(i)) && i._value
    if (null == n) return this.tween(i, null)
    if ('function' != typeof n) throw Error()
    return this.tween(i, oQ(t, n, e ?? ''))
  }
  function oG(t) {
    return function () {
      this.textContent = t
    }
  }
  function oJ(t) {
    return function () {
      var n = t(this)
      this.textContent = n ?? ''
    }
  }
  function st(t) {
    return this.tween(
      'text',
      'function' == typeof t
        ? oJ(og(this, 'text', t))
        : oG(null == t ? '' : t + '')
    )
  }
  function sn(t) {
    return function (n) {
      this.textContent = t.call(this, n)
    }
  }
  function se(t) {
    var n, e
    function i() {
      var i = t.apply(this, arguments)
      return i !== e && (n = (e = i) && sn(i)), n
    }
    return (i._value = t), i
  }
  function si(t) {
    var n = 'text'
    if (arguments.length < 1) return (n = this.tween(n)) && n._value
    if (null == t) return this.tween(n, null)
    if ('function' != typeof t) throw Error()
    return this.tween(n, se(t))
  }
  function sr() {
    for (
      var t = this._name,
        n = this._id,
        e = sa(),
        i = this._groups,
        r = i.length,
        o = 0;
      o < r;
      ++o
    )
      for (var s, l = i[o], u = l.length, a = 0; a < u; ++a)
        if ((s = l[a])) {
          var h = oc(s, n)
          ou(s, t, e, a, l, {
            time: h.time + h.delay + h.duration,
            delay: 0,
            duration: h.duration,
            ease: h.ease,
          })
        }
    return new sl(i, this._parents, t, e)
  }
  function so() {
    var t,
      n,
      e = this,
      i = e._id,
      r = e.size()
    return new Promise(function (o, s) {
      var l = { value: s },
        u = {
          value: function () {
            0 == --r && o()
          },
        }
      e.each(function () {
        var e = oh(this, i),
          r = e.on
        r !== t &&
          ((n = (t = r).copy())._.cancel.push(l),
          n._.interrupt.push(l),
          n._.end.push(u)),
          (e.on = n)
      }),
        0 === r && o()
    })
  }
  var ss = 0
  function sl(t, n, e, i) {
    ;(this._groups = t), (this._parents = n), (this._name = e), (this._id = i)
  }
  function su(t) {
    return iO().transition(t)
  }
  function sa() {
    return ++ss
  }
  var sh = iO.prototype
  function sc(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2
  }
  sl.prototype = su.prototype = {
    constructor: sl,
    select: oH,
    selectAll: oR,
    selectChild: sh.selectChild,
    selectChildren: sh.selectChildren,
    filter: oN,
    merge: o9,
    selection: oD,
    transition: sr,
    call: sh.call,
    nodes: sh.nodes,
    node: sh.node,
    size: sh.size,
    empty: sh.empty,
    each: sh.each,
    on: oE,
    attr: o2,
    attrTween: o7,
    style: oU,
    styleTween: oW,
    text: st,
    textTween: si,
    remove: oO,
    tween: o0,
    delay: oS,
    duration: oj,
    ease: oC,
    easeVarying: oI,
    end: so,
    [Symbol.iterator]: sh[Symbol.iterator],
  }
  var sf = { time: null, delay: 0, duration: 250, ease: sc }
  function s_(t, n) {
    for (var e; !(e = t.__transition) || !(e = e[n]); )
      if (!(t = t.parentNode)) throw Error(`transition ${n} not found`)
    return e
  }
  function s$(t) {
    t instanceof sl
      ? ((r = t._id), (t = t._name))
      : ((r = sa()), ((o = sf).time = rY()), (t = null == t ? null : t + ''))
    for (var n = this._groups, e = n.length, i = 0; i < e; ++i)
      for (var r, o, s, l = n[i], u = l.length, a = 0; a < u; ++a)
        (s = l[a]) && ou(s, t, r, a, l, o || s_(s, r))
    return new sl(n, this._parents, t, r)
  }
  function sp(t) {
    return [+t[0], +t[1]]
  }
  function sd(t) {
    return [sp(t[0]), sp(t[1])]
  }
  ;(iO.prototype.interrupt = o$), (iO.prototype.transition = s$)
  var s0 = {
      name: 'x',
      handles: ['w', 'e'].map(sv),
      input: function (t, n) {
        return null == t
          ? null
          : [
              [+t[0], n[0][1]],
              [+t[1], n[1][1]],
            ]
      },
      output: function (t) {
        return t && [t[0][0], t[1][0]]
      },
    },
    sg = {
      name: 'y',
      handles: ['n', 's'].map(sv),
      input: function (t, n) {
        return null == t
          ? null
          : [
              [n[0][0], +t[0]],
              [n[1][0], +t[1]],
            ]
      },
      output: function (t) {
        return t && [t[0][1], t[1][1]]
      },
    },
    s8 = {
      name: 'xy',
      handles: ['n', 'w', 'e', 's', 'nw', 'ne', 'sw', 'se'].map(sv),
      input: function (t) {
        return null == t ? null : sd(t)
      },
      output: function (t) {
        return t
      },
    }
  function sv(t) {
    return { type: t }
  }
  function sy(t) {
    for (
      var n, e, i = -1, r = t.length, o = 0, s = 0, l = t[r - 1], u = 0;
      ++i < r;

    )
      (n = l),
        (l = t[i]),
        (u += e = n[0] * l[1] - l[0] * n[1]),
        (o += (n[0] + l[0]) * e),
        (s += (n[1] + l[1]) * e)
    return [o / (u *= 3), s / u]
  }
  function sm(t, n, e) {
    ;(this.k = t), (this.x = n), (this.y = e)
  }
  sm.prototype = {
    constructor: sm,
    scale: function (t) {
      return 1 === t ? this : new sm(this.k * t, this.x, this.y)
    },
    translate: function (t, n) {
      return (0 === t) & (0 === n)
        ? this
        : new sm(this.k, this.x + this.k * t, this.y + this.k * n)
    },
    apply: function (t) {
      return [t[0] * this.k + this.x, t[1] * this.k + this.y]
    },
    applyX: function (t) {
      return t * this.k + this.x
    },
    applyY: function (t) {
      return t * this.k + this.y
    },
    invert: function (t) {
      return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k]
    },
    invertX: function (t) {
      return (t - this.x) / this.k
    },
    invertY: function (t) {
      return (t - this.y) / this.k
    },
    rescaleX: function (t) {
      return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t))
    },
    rescaleY: function (t) {
      return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t))
    },
    toString: function () {
      return 'translate(' + this.x + ',' + this.y + ') scale(' + this.k + ')'
    },
  }
  var sx = new sm(1, 0, 0)
  function sw(t) {
    for (; !t.__zoom; ) if (!(t = t.parentNode)) return sx
    return t.__zoom
  }
  sw.prototype = sm.prototype
  var s3 = { width: 1024, height: 1024, points: [], relaxIterations: 8 }
  function s2(t) {
    ;(t = Object.assign({}, s3, t)).points = t.points.map((t) => [t.x, t.y])
    let n = nF.from(t.points),
      e = n.voronoi([0, 0, t.width, t.height]),
      i = []
    for (let r = 0; r < t.relaxIterations; r++) {
      for (let o = 0; o < n.points.length; o += 2) {
        let s = e.cellPolygon(o >> 1)
        if (null === s) continue
        let l = n.points[o],
          u = n.points[o + 1],
          [a, h] = sy(s)
        ;(n.points[o] = l + (a - l) * 1), (n.points[o + 1] = u + (h - u) * 1)
      }
      e.update()
    }
    for (let c = 0; c < n.points.length; c += 2) {
      let f = n.points[c],
        _ = n.points[c + 1]
      i.push({ x: f, y: _ })
    }
    let $ = []
    for (let p = 0; p < n.points.length; p += 2) {
      let d = e.cellPolygon(p >> 1)
      null !== d &&
        $.push({
          ...s1(d),
          neighbors: [...e.neighbors(p)].map((t) => ({
            ...s1(e.cellPolygon(t)),
          })),
        })
    }
    return {
      cells: $.map((t, n) => {
        let i = [...e.neighbors(n)]
        return (t.neighbors = i.map((t) => $[t])), t
      }),
      points: i,
    }
  }
  function s1(t) {
    return {
      points: t,
      innerCircleRadius: s4(t),
      centroid: { x: sy(t)[0], y: sy(t)[1] },
    }
  }
  function s4(t) {
    let n = sy(t),
      e = sb(n, t),
      i = I(n, e[0], e[1])
    for (let r = 1; r < t.length - 1; r++)
      if (t[r + 1]) {
        let o = I(n, e[r], e[r + 1])
        o < i && (i = o)
      }
    return i
  }
  function sb(t, n) {
    let e = t,
      i = n.slice(0),
      r = (t, n) =>
        (180 * Math.atan2(t[1] - e[1], t[0] - e[0])) / Math.PI -
        (180 * Math.atan2(n[1] - e[1], n[0] - e[0])) / Math.PI
    return i.sort(r), i
  }
  var s5 = f(b()),
    s7 = {
      width: 200,
      height: 200,
      resolution: 8,
      xInc: 0.01,
      yInc: 0.01,
      seed: 1e3 * Math.random(),
    },
    s6 = [...Array(8)].map((t, n) => `--fluid-pattern-color-${n + 1}`),
    sk = class {
      static get inputProperties() {
        return [
          '--fluid-pattern-seed',
          '--fluid-pattern-bg-color',
          '--fluid-pattern-shape-bias-circle',
          '--fluid-pattern-shape-bias-arc',
          '--fluid-pattern-shape-bias-line',
          '--fluid-pattern-shape-bias-rect',
          '--fluid-pattern-points',
          ...s6,
        ]
      }
      propToString(t) {
        return t.toString().trim()
      }
      getDefinedColors(t) {
        return s6.map((n) => this.propToString(t.get(n))).filter((t) => t)
      }
      paint(t, n, e) {
        let { width: i, height: r } = n,
          o = this.propToString(e.get('--fluid-pattern-seed')) || 123456
        P(o)
        let s = this.propToString(e.get('--fluid-pattern-bg-color')),
          l = this.getDefinedColors(e),
          u = {
            circle:
              parseFloat(e.get('--fluid-pattern-shape-bias-circle')) || T(0, 8),
            arc: parseFloat(e.get('--fluid-pattern-shape-bias-arc')) || T(0, 8),
            line:
              parseFloat(e.get('--fluid-pattern-shape-bias-line')) || T(0, 8),
            rectangle:
              parseFloat(e.get('--fluid-pattern-shape-bias-rect')) || T(0, 8),
          },
          a = e.get('--fluid-pattern-points')
        a = 1 === a.length ? parseInt(a) : 24
        let { cells: h } = s2({
          width: i,
          height: r,
          points: [...Array(a)].map(() => ({ x: T(0, i), y: T(0, r) })),
          relaxIterations: 6,
        })
        ;(t.fillStyle = s),
          t.fillRect(0, 0, i, r),
          (t.lineCap = 'round'),
          h.forEach((n) => {
            n.innerCircleRadius *= 0.75
            let e = T(
              sC([
                { value: 'circle', count: u.circle },
                { value: 'arc', count: u.arc },
                { value: 'line', count: u.line },
                { value: 'rectangle', count: u.rectangle },
              ])
            )
            t.lineWidth = Math.min(n.innerCircleRadius, 40)
            let i = T(l)
            ;(t.fillStyle = i), (t.strokeStyle = i)
            let r = T(n.innerCircleRadius / 1.5, n.innerCircleRadius),
              o = T(0, 360)
            switch ((t.save(), sA(t, n.centroid.x, n.centroid.y, o), e)) {
              case 'circle':
                sS(t, n.centroid.x, n.centroid.y, r),
                  T(0, 1) > 0.5 &&
                    ((t.fillStyle = s),
                    sS(t, n.centroid.x, n.centroid.y, r / 2))
                break
              case 'arc':
                sP(t, n.centroid.x, n.centroid.y, r),
                  T(0, 1) > 0.5 &&
                    ((t.fillStyle = s),
                    sP(t, n.centroid.x, n.centroid.y - 1, r / 2))
                break
              case 'line':
                sT(t, n.centroid.x, n.centroid.y, 0.5 * r)
                break
              case 'rectangle':
                sj(t, n.centroid.x, n.centroid.y, r)
            }
            t.restore()
          })
      }
    }
  function sS(t, n, e, i) {
    t.beginPath(), t.arc(n, e, i, 0, 2 * Math.PI), t.fill()
  }
  function sP(t, n, e, i) {
    t.beginPath(), t.arc(n, e, i, 0, 1 * Math.PI), t.fill()
  }
  function sT(t, n, e, i) {
    t.beginPath(),
      t.moveTo(n - i / 2, e - i / 2),
      t.lineTo(n + i, e + i),
      t.stroke()
  }
  function sj(t, n, e, i) {
    t.fillRect(n - i / 2, e - i / 2, i, i)
  }
  function sA(t, n, e, i) {
    t.translate(n, e), t.rotate((i * Math.PI) / 180), t.translate(-n, -e)
  }
  function sC(t) {
    let n = []
    return (
      t.forEach((t) => {
        for (let e = 0; e < t.count; e++) n.push(t.value)
      }),
      n
    )
  }
  registerPaint('fluidPattern', sk)
})()

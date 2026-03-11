# Guia de Segurança — Amanda Vilalba

## Headers HTTP recomendados

Os headers de segurança devem ser configurados no servidor HTTP.
O arquivo `.htaccess` já cuida disso para servidores **Apache**.

---

## Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options",           "value": "DENY" },
        { "key": "X-Content-Type-Options",     "value": "nosniff" },
        { "key": "Referrer-Policy",            "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy",         "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security",  "value": "max-age=31536000; includeSubDomains" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://amandavilalba.com; connect-src 'self'; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

---

## Netlify (`netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://amandavilalba.com; connect-src 'self'; frame-ancestors 'none';"
```

---

## Nginx (`nginx.conf`)

```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://amandavilalba.com; connect-src 'self'; frame-ancestors 'none';" always;
```

---

## Cloudflare (painel)

Acesse: **Security → Headers** e adicione os mesmos headers acima via Transform Rules.

---

## Checklist pós-deploy

- [ ] Testar headers em: https://securityheaders.com
- [ ] Testar SEO em: https://pagespeed.web.dev
- [ ] Registrar no Google Search Console: https://search.google.com/search-console
- [ ] Adicionar código de verificação do Search Console no `index.html` (linha comentada no `<head>`)
- [ ] Verificar og:image em: https://www.opengraph.xyz

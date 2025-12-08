<?php

include_once 'helpers.php';
date_default_timezone_set('Europe/Paris');

return [
  'date' => [
    'handler' => 'intl',
    'formats' => [
      'file' => intl('yyyyMMdd'),
      'iso' => intl('yyyy-MM-dd'),
      'full' => intl('dd MMMM yyyy')
    ]
  ],

  'thumbs' => [
    'driver' => 'im',

    'srcsets' => [
      'default' => [
        '200w' => ['width' => 200, 'format' => 'webp'],
        '600w' => ['width' => 600, 'format' => 'webp'],
        '800w' => ['width' => 800, 'format' => 'webp'],
        '1200w' => ['width' => 1200, 'format' => 'webp'],
        '1600w' => ['width' => 1600, 'format' => 'webp'],
        '1920w' => ['width' => 1920, 'format' => 'webp']
      ]
    ],

    'sizes' => [
      'default' => '100vw',
      'small' => '1vw',
      'half' => implode(',', [
        '(max-width: 1024px) 100vw',
        '50vw'
      ]),
      'card' => implode(',', [
        '(max-width: 800px) 100vw',
        '(max-width: 1024px) 25vw',
        '20vw'
      ])
    ]
  ],

  'panel' => [
    'menu' => function ($kirby) {
      return [
        'site' => [
          'label' => 'Accueil',
          'current' => function () : bool {
            $links = ['site'];
            $path  = Kirby\Cms\App::instance()->path();
            return Str::contains($path, 'site');
          }
        ],
        // Add pages here if needed
        // 'projects' => menu($kirby, 'projects'),
        '-',
        'users',
        'languages',
        'system'
      ];
    }
  ],

  'sitemap' => [
    'ignore' => ['error']
  ],

  'routes' => [
    [ // Sitemap for robots
      'pattern' => ['sitemap.xml', 'sitemap_index.xml'],
      'action'  => function () {
        $content = snippet('html/sitemap', [
          'pages' => site()->pages()->index(),
          'ignore' => kirby()->option('sitemap.ignore', ['error'])
        ], true);
        return new Kirby\Cms\Response($content, 'application/xml');
      }
    ],

    [ // Sitemap for humans
      'pattern' => 'sitemap',
      'action' => function () {
        return new Page(['slug' => 'sitemap', 'template' => 'sitemap']);
      }
    ],

    [ // Quick panel access from any page by appending /panel to the url
      'pattern' => '(:all)/panel',
      'action' => function ($uid) {
        if ($page = page($uid)) return go($page->panel()->url());
        return go('/panel');
      }
    ]
  ],

  'ready' => fn () => [
    'panel' => [
      'css' => vite()->panelCss('panel.js'),
      'js' => vite()->panelJs('panel.js')
    ]
  ]
];

<?php

return array_merge(require_once 'credentials.php', [
 'sitemap.ignore' => ['projects'],

  'panel' => [
    'css' => 'assets/css/panel.css',
    'language' => 'fr'
  ],

  'cache' => [
    'pages' => [
      'active' => true
    ]
  ],

  'routes' => [
    [ // Sitemap
      'pattern' => ['sitemap', 'sitemap.xml', 'sitemap_index.xml'],
      'action'  => function() {
        $pages = site()->pages()->index();
        $ignore = kirby()->option('sitemap.ignore', ['error']);
        $content = snippet('html/sitemap', compact('pages', 'ignore'), true);
        return new Kirby\Cms\Response($content, 'application/xml');
      }
    ]
  ]
]);

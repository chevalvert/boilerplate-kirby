<link rel='icon' type='image/png' href='/assets/favicons/favicon-96x96.png' sizes='96x96' />
<link rel='icon' type='image/svg+xml' href='/assets/favicons/favicon.svg' />
<link rel='shortcut icon' href='/assets/favicons/favicon.ico' />
<link rel='apple-touch-icon' sizes='180x180' href='/assets/favicons/apple-touch-icon.png' />
<meta name='apple-mobile-web-app-title' content='machines.studio' />
<link rel='manifest' href='/assets/favicons/site.webmanifest' />
<meta name='theme-color' content='#e4e4e4' />

<?php foreach ($kirby->languages() as $language) : ?>
  <link rel='alternate' hreflang='<?= $language->code() ?>' href='<?= $page->url($language->code()) ?>' />
<?php endforeach ?>

<?php
  $title = r($page !== $site->homePage(), Str::unhtml($page->title()) . ' | ') . $site->title();
  $description = $page->seo_description()->or($site->seo_description());
  $keywords = implode(', ', array_unique([
    ...$site->seo_keywords()->split(),
    ...$page->seo_keywords()->split()
  ]));

  $cover = (
    $page->seo_cover()->toFile() ??
    $page->thumbnail()->toFile() ??
    $site->seo_cover()->toFile()
  )?->crop(1200, 628);

  $metas = [
    'application-name' => $title,
    'description' => $description,
    'keywords' => $keywords,
    'og:url' => $site->url(),
    'og:type' => 'website',
    'og:title' => $title,
    'og:image' => $cover?->url(),
    'og:image:width' => $cover?->width(),
    'og:image:height' => $cover?->height(),
    'og:description' => $description,
    'og:site_name' => $title,
    'og:locale' => $kirby->language()->code()
  ];

  foreach ($metas as $name => $content) {
    if (!$content) continue;
    echo Html::tag('meta', null, [
      'name' => $name,
      'property' => $name,
      'content' => Escape::html($content)
    ]);
  }

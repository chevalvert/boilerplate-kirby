<?php
  /**
   * Output a link from a page or an array
   * snippet('html/link', $page);
   * snippet('html/link', ['url' => 'https://example.com', 'title' => 'Example', 'attributes' => []]);
   */

  $item ??= null; // $item contains the whole object passed to a snippet

  if ($item instanceof \Kirby\Cms\Page) {
    echo Html::a($item->url(), $item->title(), [
      'class' => r($item->isOpen() || $item->isActive(), 'is-active'),
      'target' => Str::startsWith($item->url(), $site->url())
        ? null
        : (
          Str::startsWith($item->url(), '#')
            ? null
            : '_blank'
          )
    ]);
  } else {
    $url ??= null;
    if (!trim($url ?? '')) return

    $title ??= $url ?? null;
    $active ??= $active ?? false;

    $attributes ??= [];
    if ($active) $attributes['class'] = ($attributes['class'] ?? '') . ' is-active';
    if (!Str::startsWith($url, $site->url()) && !Str::startsWith($url, '#')) $attributes['target'] = '_blank';

    echo Html::a($url, [$title ?? $url], $attributes);
  }
?>

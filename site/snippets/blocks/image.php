<?php snippet('html/image', [
  'image' => $block->image()->toFile(),
  'caption' => $block->caption(),
  'attributes' => [
    'data-size' => $block->size(),
    'data-alignment' => $block->alignment()->or('center')
  ],
  'presets' => $block->size()->or('default')
]) ?>

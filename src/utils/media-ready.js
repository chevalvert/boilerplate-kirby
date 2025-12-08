import noop from '/utils/noop'

export default async (media, callback = noop) => {
  await (
    media instanceof HTMLImageElement
      ? (media.complete && media.naturalWidth !== 0) ||
        new Promise(resolve => media.addEventListener('load', resolve, { once: true }))
      : media instanceof HTMLVideoElement
        ? (media.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) ||
        new Promise(resolve => media.addEventListener('canplay', resolve, { once: true }))
        : true
  )

  return callback(media)
}

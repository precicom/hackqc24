import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'youtubeEmbedUrl',
  standalone: true
})
export class YoutubeEmbedUrlPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer  )

  transform(url: string): SafeResourceUrl  {
    return this.sanitizer.bypassSecurityTrustResourceUrl(convertToEmbedURL(url))
  }
}

export function convertToEmbedURL(url) {
  // Extract the video ID from the URL
  const videoId = url.split('v=')[1].split('&')[0];
  
  // Construct the embed URL
  const embedURL = `https://www.youtube.com/embed/${videoId}`;
  
  return embedURL;
}

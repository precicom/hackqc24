import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core';

@Directive({
  selector: '[imagePreview]',
  standalone: true
})
export class ImagePreviewDirective implements AfterViewInit {
  @Input() imagePreview: HTMLImageElement
  @Output() imagePreviewFile = new EventEmitter<File>()

  elementRef = inject(ElementRef)

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.addEventListener('change', () => {
      const reader = new FileReader()

      const file = this.elementRef.nativeElement.files.item(0)

      reader.onloadend = () => {
        this.imagePreview.src = reader.result as string
      }

      if (file) {
        reader.readAsDataURL(file)
      }

      this.imagePreviewFile.emit(file)
    })
  }
}

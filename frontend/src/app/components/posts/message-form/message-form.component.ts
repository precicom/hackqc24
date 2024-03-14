import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ImagePreviewDirective } from '../../../directives/image-preview.directive';


export interface MessageSubmitEvent {
  file: File,
  text: string
}

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule, ImagePreviewDirective],
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.scss'
})
export class MessageFormComponent {
  @ViewChild('textArea', { static: false }) textAreaRef: ElementRef<HTMLTextAreaElement>
  @ViewChild('fileInput', { static: false }) fileInputRef: ElementRef<HTMLInputElement>
  @ViewChild('imagePreview', { static: false }) imagePreviewRef: ElementRef<HTMLImageElement>
  
  @Input() loading: boolean = false
  @Output() onSubmit = new EventEmitter<MessageSubmitEvent>()  

  file: File
  posting: boolean = true

  setFile(file: File) {
    this.file = file
  }
  
  clearCommentBox() {
    this.textAreaRef.nativeElement.value = ''
    this.fileInputRef.nativeElement.value = ''
    this.file = null
  }

  submit(fileInput: HTMLInputElement, textArea: HTMLTextAreaElement) {
    const text = textArea.value
    const file = fileInput.files[0]

    this.onSubmit.emit({ file, text })   
  }
}

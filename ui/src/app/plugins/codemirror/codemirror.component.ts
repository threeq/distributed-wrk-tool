import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/lua/lua';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/display/fullscreen';

@Component({
  selector: 'codemirror',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemirrorComponent),
      multi: true
    }
  ],
  template: `<textarea #host placeholder="{{placeholder}}"></textarea>`,
  styleUrls:['./codemirror.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CodemirrorComponent implements AfterViewInit, OnDestroy {

  @Input() config; // config http://codemirror.net/doc/manual.html#config
  @Input() placeholder;

  @Output() change = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() cursorActivity = new EventEmitter();

  @ViewChild('host') host;

  @Output() instance = null;

  _value = '';

  /**
   * Constructor
   */
  constructor() {}

  get value() { return this._value; }

  @Input() set value(v) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  /**
   * On component destroy
   */
  ngOnDestroy() {

  }

  /**
   * On component view init
   */
  ngAfterViewInit() {
    this.config = this.config || {};
    this.codemirrorInit(this.config);
  }

  /**
   * Initialize codemirror
   */
  codemirrorInit(config) {
    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, config);
    this.instance.setValue(this._value);

    this.instance.on('change', () => {
      this.updateValue(this.instance.getValue());
    });

    this.instance.on('focus', (instance, event) => {
      this.focus.emit({instance, event});
    });

    this.instance.on('cursorActivity', (instance) => {
      this.cursorActivity.emit({instance});
    });

    this.instance.on('blur', (instance, event) => {
      this.blur.emit({instance, event});
    });
  }

  /**
   * Value update process
   */
  updateValue(value) {
    this.value = value;
    this.onTouched();
    this.change.emit(value);
  }

  /**
   * Implements ControlValueAccessor
   */
  writeValue(value) {
    this._value = value || '';
    if (this.instance) {
      this.instance.setValue(this._value);
    }
  }
  onChange(_) {}
  onTouched() {}
  registerOnChange(fn) { this.onChange = fn; }
  registerOnTouched(fn) { this.onTouched = fn; }
}

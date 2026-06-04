import { Injectable, signal } from '@angular/core';

export type FeedbackSound =
  | 'click'
  | 'focus'
  | 'success'
  | 'error'
  | 'warning'
  | 'toggle-on'
  | 'toggle-off'
  | 'open'
  | 'close'
  | 'delete'
  | 'navigate'
  | 'check'
  | 'uncheck'
  | 'tab-select'
  | 'hover';

@Injectable({ providedIn: 'root' })
export class AudioFeedbackService {
  private audioCtx: AudioContext | null = null;
  private _enabled = signal(true);
  private _volume = signal(0.3);

  readonly enabled = this._enabled.asReadonly();
  readonly volume = this._volume.asReadonly();

  private getCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  toggle(): void {
    this._enabled.update(e => !e);
  }

  setEnabled(value: boolean): void {
    this._enabled.set(value);
  }

  setVolume(v: number): void {
    this._volume.set(Math.max(0, Math.min(1, v)));
  }

  play(sound: FeedbackSound): void {
    if (!this._enabled()) return;
    try {
      const ctx = this.getCtx();
      const vol = this._volume();

      switch (sound) {
        case 'click':
          this.playTone(ctx, 800, 0.06, vol, 'sine');
          break;
        case 'focus':
          this.playTone(ctx, 600, 0.04, vol * 0.5, 'sine');
          break;
        case 'success':
          this.playSequence(ctx, [523, 659, 784], 0.1, vol);
          break;
        case 'error':
          this.playSequence(ctx, [300, 250, 200], 0.12, vol);
          break;
        case 'warning':
          this.playSequence(ctx, [440, 520], 0.1, vol);
          break;
        case 'toggle-on':
          this.playSequence(ctx, [400, 600], 0.08, vol);
          break;
        case 'toggle-off':
          this.playSequence(ctx, [600, 400], 0.08, vol);
          break;
        case 'open':
          this.playSequence(ctx, [400, 500, 600], 0.07, vol);
          break;
        case 'close':
          this.playSequence(ctx, [600, 500, 400], 0.07, vol);
          break;
        case 'delete':
          this.playSequence(ctx, [500, 350, 200], 0.1, vol);
          break;
        case 'navigate':
          this.playTone(ctx, 700, 0.05, vol, 'sine');
          break;
        case 'check':
          this.playSequence(ctx, [523, 659], 0.08, vol);
          break;
        case 'uncheck':
          this.playSequence(ctx, [659, 523], 0.08, vol);
          break;
        case 'tab-select':
          this.playTone(ctx, 550, 0.05, vol, 'sine');
          break;
        case 'hover':
          this.playTone(ctx, 500, 0.03, vol * 0.3, 'sine');
          break;
      }
    } catch {
      // AudioContext not available
    }
  }

  private playTone(
    ctx: AudioContext,
    freq: number,
    duration: number,
    vol: number,
    type: OscillatorType = 'sine'
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private playSequence(
    ctx: AudioContext,
    freqs: number[],
    stepDuration: number,
    vol: number
  ): void {
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * stepDuration);
      gain.gain.setValueAtTime(vol, ctx.currentTime + i * stepDuration);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + (i + 1) * stepDuration
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * stepDuration);
      osc.stop(ctx.currentTime + (i + 1) * stepDuration);
    });
  }
}

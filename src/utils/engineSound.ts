/**
 * Web Audio API based high-fidelity classic Big-Block V8 engine sound synthesizer
 * Accurately models the exact acoustic signature of the reference sample:
 * 1. Heavy starter compression cranks (0.0s - 0.75s)
 * 2. Instant explosive ignition catch & 1st aggressive throttle blip (0.75s - 1.8s)
 * 3. 2nd deep throttle snap / rev (1.8s - 3.2s)
 * 4. Deceleration burble with exhaust pulse pops (3.2s - 4.5s)
 * 5. Signature chopped lumpy cam idle lope (4.5s - 6.0s)
 */
class EngineSoundEngine {
  private ctx: AudioContext | null = null;
  public isPlaying = false;
  private activeNodes: { stop: () => void }[] = [];
  private mainGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Warm overdrive curve for deep big-block exhaust rasp
  private makeDistortionCurve(amount = 18): Float32Array {
    const k = typeof amount === 'number' ? amount : 18;
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    for (let i = 0; i < nSamples; ++i) {
      const x = (i * 2) / nSamples - 1;
      curve[i] = ((2.5 + k) * x * 18 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Generate exhaust gas turbulent noise buffer
  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.7;
    }
    return buffer;
  }

  public playIgnitionStartup(
    onProgress?: (stage: 'crank' | 'ignition' | 'rev' | 'idle') => void, 
    durationSec = 5.8
  ) {
    try {
      this.stop();
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const ctx = this.ctx;

      // Master output stage with dedicated Deep Bass Sub-Shelf Filter
      const bassBooster = ctx.createBiquadFilter();
      bassBooster.type = 'lowshelf';
      bassBooster.frequency.setValueAtTime(130, now);
      bassBooster.gain.setValueAtTime(9.5, now); // +9.5dB deep sub-bass boost

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.9, now);
      
      bassBooster.connect(ctx.destination);
      masterGain.connect(bassBooster);
      this.mainGain = masterGain;

      // =======================================================
      // STAGE 1: HEAVY MECHANICAL STARTER CRANK (0.0s -> 0.75s)
      // 3 slow, heavy compression strokes (thump... thump... thump...)
      // =======================================================
      onProgress?.('crank');

      const starterMotorOsc = ctx.createOscillator();
      const starterFilter = ctx.createBiquadFilter();
      const starterGain = ctx.createGain();

      starterMotorOsc.type = 'sawtooth';
      starterMotorOsc.frequency.setValueAtTime(20, now);
      starterMotorOsc.frequency.linearRampToValueAtTime(28, now + 0.72);

      starterFilter.type = 'lowpass';
      starterFilter.frequency.setValueAtTime(150, now);
      starterFilter.Q.setValueAtTime(2.2, now);

      // Heavy cranking compression envelope
      starterGain.gain.setValueAtTime(0.001, now);
      starterGain.gain.linearRampToValueAtTime(0.48, now + 0.08);
      starterGain.gain.exponentialRampToValueAtTime(0.04, now + 0.22);
      starterGain.gain.linearRampToValueAtTime(0.55, now + 0.32);
      starterGain.gain.exponentialRampToValueAtTime(0.05, now + 0.46);
      starterGain.gain.linearRampToValueAtTime(0.65, now + 0.56);
      starterGain.gain.linearRampToValueAtTime(0.001, now + 0.74);

      starterMotorOsc.connect(starterFilter);
      starterFilter.connect(starterGain);
      starterGain.connect(masterGain);

      starterMotorOsc.start(now);
      starterMotorOsc.stop(now + 0.76);

      // =======================================================
      // STAGE 2: IGNITION BURST & DUAL AGGRESSIVE THROTTLE ROARS
      // 0.75s: Explosive ignition & 1st rev blip (~135Hz)
      // 1.80s: 2nd deeper throttle stab (~145Hz)
      // 3.20s: Decel burble & exhaust throatiness
      // 4.50s: Chopped cam lope idle (chop... chop... chop...)
      // =======================================================
      const catchTime = now + 0.75;
      setTimeout(() => onProgress?.('ignition'), 750);
      setTimeout(() => onProgress?.('rev'), 1200);
      setTimeout(() => onProgress?.('idle'), 3500);

      // --- 1. Primary Cross-Plane V8 Cylinder Bank (Sawtooth) ---
      const v8Osc1 = ctx.createOscillator();
      v8Osc1.type = 'sawtooth';
      
      // Pitch trajectory matching the reference engine revs:
      v8Osc1.frequency.setValueAtTime(24, catchTime);
      v8Osc1.frequency.exponentialRampToValueAtTime(132, catchTime + 0.50);
      v8Osc1.frequency.exponentialRampToValueAtTime(58, catchTime + 1.00);
      v8Osc1.frequency.exponentialRampToValueAtTime(145, catchTime + 1.55);
      v8Osc1.frequency.exponentialRampToValueAtTime(52, catchTime + 2.65);
      v8Osc1.frequency.linearRampToValueAtTime(24, catchTime + 3.75);
      v8Osc1.frequency.setValueAtTime(23, now + durationSec);

      // --- 2. Secondary Bank (Detuned Twin Exhaust Pipes) ---
      const v8Osc2 = ctx.createOscillator();
      v8Osc2.type = 'sawtooth';
      v8Osc2.detune.setValueAtTime(14, catchTime);
      v8Osc2.frequency.setValueAtTime(24.3, catchTime);
      v8Osc2.frequency.exponentialRampToValueAtTime(133.5, catchTime + 0.50);
      v8Osc2.frequency.exponentialRampToValueAtTime(58.8, catchTime + 1.00);
      v8Osc2.frequency.exponentialRampToValueAtTime(146.5, catchTime + 1.55);
      v8Osc2.frequency.exponentialRampToValueAtTime(52.6, catchTime + 2.65);
      v8Osc2.frequency.linearRampToValueAtTime(24.4, catchTime + 3.75);
      v8Osc2.frequency.setValueAtTime(23.4, now + durationSec);

      // --- 3. Camshaft Valve & Combustion Grit (Triangle harmonic) ---
      const v8Harmonic = ctx.createOscillator();
      v8Harmonic.type = 'triangle';
      v8Harmonic.frequency.setValueAtTime(48, catchTime);
      v8Harmonic.frequency.exponentialRampToValueAtTime(264, catchTime + 0.50);
      v8Harmonic.frequency.exponentialRampToValueAtTime(116, catchTime + 1.00);
      v8Harmonic.frequency.exponentialRampToValueAtTime(290, catchTime + 1.55);
      v8Harmonic.frequency.exponentialRampToValueAtTime(104, catchTime + 2.65);
      v8Harmonic.frequency.linearRampToValueAtTime(48, catchTime + 3.75);
      v8Harmonic.frequency.setValueAtTime(46, now + durationSec);

      // --- 4. Sub-bass Chest Punch (Sine wave 20Hz -> 65Hz) ---
      const subBass = ctx.createOscillator();
      subBass.type = 'sine';
      subBass.frequency.setValueAtTime(20, catchTime);
      subBass.frequency.exponentialRampToValueAtTime(62, catchTime + 0.50);
      subBass.frequency.exponentialRampToValueAtTime(32, catchTime + 1.00);
      subBass.frequency.exponentialRampToValueAtTime(68, catchTime + 1.55);
      subBass.frequency.exponentialRampToValueAtTime(28, catchTime + 2.65);
      subBass.frequency.linearRampToValueAtTime(20, catchTime + 3.75);
      subBass.frequency.setValueAtTime(19, now + durationSec);

      // --- 5. LFO for Chopped Cam Lope (Lumpy Cam Modulation at 4.6 Hz) ---
      const camLFO = ctx.createOscillator();
      const camLFOGain = ctx.createGain();
      camLFO.type = 'sine';
      camLFO.frequency.setValueAtTime(4.6, catchTime); // 4.6 beats per second cam lope
      
      // The LFO only takes effect during idle (after 3.5s)
      camLFOGain.gain.setValueAtTime(0.001, catchTime);
      camLFOGain.gain.setValueAtTime(0.001, catchTime + 3.0);
      camLFOGain.gain.linearRampToValueAtTime(0.28, catchTime + 3.8); // Kick in the lumpy lope
      camLFOGain.gain.setValueAtTime(0.28, now + durationSec);

      camLFO.connect(camLFOGain);

      // --- Waveshaper Warm Header Overdrive ---
      const waveShaper = ctx.createWaveShaper();
      waveShaper.curve = this.makeDistortionCurve(16);
      waveShaper.oversample = '4x';

      // --- Main Lowpass Sweep (Dual Throttle Openings) ---
      const mainFilter = ctx.createBiquadFilter();
      mainFilter.type = 'lowpass';
      mainFilter.frequency.setValueAtTime(220, catchTime);
      mainFilter.frequency.exponentialRampToValueAtTime(1250, catchTime + 0.50); // 1st rev
      mainFilter.frequency.exponentialRampToValueAtTime(550, catchTime + 1.00);
      mainFilter.frequency.exponentialRampToValueAtTime(1400, catchTime + 1.55); // 2nd rev
      mainFilter.frequency.exponentialRampToValueAtTime(420, catchTime + 2.65); // decel
      mainFilter.frequency.exponentialRampToValueAtTime(200, catchTime + 3.75); // cam idle
      mainFilter.Q.setValueAtTime(3.0, catchTime);

      // --- Resonator Peaking (Chambered Dual Exhaust Rumble) ---
      const peakFilter = ctx.createBiquadFilter();
      peakFilter.type = 'peaking';
      peakFilter.frequency.setValueAtTime(220, catchTime);
      peakFilter.frequency.exponentialRampToValueAtTime(580, catchTime + 0.50);
      peakFilter.frequency.exponentialRampToValueAtTime(280, catchTime + 1.00);
      peakFilter.frequency.exponentialRampToValueAtTime(620, catchTime + 1.55);
      peakFilter.frequency.exponentialRampToValueAtTime(220, catchTime + 3.75);
      peakFilter.gain.setValueAtTime(8.0, catchTime);
      peakFilter.Q.setValueAtTime(1.8, catchTime);

      // --- Exhaust Gas Turbulent Air Rush ---
      let exhaustNoise: AudioBufferSourceNode | null = null;
      const noiseBuf = this.createNoiseBuffer();
      if (noiseBuf) {
        exhaustNoise = ctx.createBufferSource();
        exhaustNoise.buffer = noiseBuf;
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(280, catchTime);
        noiseFilter.frequency.exponentialRampToValueAtTime(950, catchTime + 0.50);
        noiseFilter.frequency.exponentialRampToValueAtTime(400, catchTime + 1.00);
        noiseFilter.frequency.exponentialRampToValueAtTime(1050, catchTime + 1.55);
        noiseFilter.frequency.exponentialRampToValueAtTime(320, catchTime + 3.75);
        noiseFilter.Q.setValueAtTime(1.4, catchTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, catchTime);
        noiseGain.gain.linearRampToValueAtTime(0.22, catchTime + 0.50);
        noiseGain.gain.linearRampToValueAtTime(0.08, catchTime + 1.00);
        noiseGain.gain.linearRampToValueAtTime(0.25, catchTime + 1.55);
        noiseGain.gain.exponentialRampToValueAtTime(0.05, catchTime + 3.5);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + durationSec);

        exhaustNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        exhaustNoise.start(catchTime);
        exhaustNoise.stop(now + durationSec);
      }

      // --- Engine Core Amplitude Envelope ---
      const engineGain = ctx.createGain();
      engineGain.gain.setValueAtTime(0.001, catchTime);
      engineGain.gain.linearRampToValueAtTime(0.70, catchTime + 0.12); // Catch
      engineGain.gain.linearRampToValueAtTime(0.85, catchTime + 0.50); // 1st peak
      engineGain.gain.exponentialRampToValueAtTime(0.55, catchTime + 1.00);
      engineGain.gain.linearRampToValueAtTime(0.90, catchTime + 1.55); // 2nd full peak
      engineGain.gain.exponentialRampToValueAtTime(0.52, catchTime + 2.70); // decel
      engineGain.gain.exponentialRampToValueAtTime(0.38, catchTime + 3.75); // cam idle
      engineGain.gain.exponentialRampToValueAtTime(0.01, now + durationSec); // Fade out

      // Connect LFO modulation to engine gain for rhythmic lumpy cam chop
      camLFOGain.connect(engineGain.gain);

      // Sub-bass dedicated boost gain
      const subBassGain = ctx.createGain();
      subBassGain.gain.setValueAtTime(0.65, catchTime);
      subBass.connect(subBassGain);
      subBassGain.connect(masterGain);

      // Connect synthesis graph
      v8Osc1.connect(waveShaper);
      v8Osc2.connect(waveShaper);
      v8Harmonic.connect(waveShaper);
      waveShaper.connect(mainFilter);
      mainFilter.connect(peakFilter);
      peakFilter.connect(engineGain);

      engineGain.connect(masterGain);

      // Start main oscillators
      v8Osc1.start(catchTime);
      v8Osc2.start(catchTime);
      v8Harmonic.start(catchTime);
      subBass.start(catchTime);
      camLFO.start(catchTime);

      v8Osc1.stop(now + durationSec);
      v8Osc2.stop(now + durationSec);
      v8Harmonic.stop(now + durationSec);
      subBass.stop(now + durationSec);
      camLFO.stop(now + durationSec);

      this.activeNodes = [
        { stop: () => { try { starterMotorOsc.stop(); } catch {} } },
        { stop: () => { try { v8Osc1.stop(); } catch {} } },
        { stop: () => { try { v8Osc2.stop(); } catch {} } },
        { stop: () => { try { v8Harmonic.stop(); } catch {} } },
        { stop: () => { try { subBass.stop(); } catch {} } },
        { stop: () => { try { camLFO.stop(); } catch {} } },
      ];

      if (exhaustNoise) {
        this.activeNodes.push({ stop: () => { try { exhaustNoise?.stop(); } catch {} } });
      }

      this.isPlaying = true;
      setTimeout(() => {
        this.isPlaying = false;
      }, durationSec * 1000);

    } catch {
      // Graceful fallback if AudioContext is prevented before user interaction
    }
  }

  public playEngineProfile(
    profile: 'v8_rumble' | 'flat6_scream' | 'mopar_growl' | 'v12_symphony' | 'inline6_f1' | 'classic_rev', 
    durationSec = 3.5
  ) {
    this.playIgnitionStartup(undefined, durationSec);
  }

  public playRev(
    profile: 'v8_rumble' | 'flat6_scream' | 'mopar_growl' | 'v12_symphony' | 'inline6_f1' | 'classic_rev' = 'v8_rumble'
  ) {
    this.playIgnitionStartup(undefined, 3.2);
  }

  public stop() {
    try {
      this.activeNodes.forEach(node => {
        try { node.stop(); } catch {}
      });
      this.activeNodes = [];
      if (this.mainGain && this.ctx) {
        this.mainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      }
      this.isPlaying = false;
    } catch {}
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const engineSound = new EngineSoundEngine();

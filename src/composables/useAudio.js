import { ref } from 'vue'

export const useAudio = () => {
  const audioContext = ref(null)
  
  const initAudio = () => {
    if (!audioContext.value) {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  const playSound = (type) => {
    initAudio()
    
    const context = audioContext.value
    let oscillator = context.createOscillator()
    let gainNode = context.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    
    switch(type) {
      case 'success':
        oscillator.frequency.setValueAtTime(523.25, context.currentTime)
        oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, context.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)
        oscillator.start(context.currentTime)
        oscillator.stop(context.currentTime + 0.5)
        break
      case 'failure':
        oscillator.frequency.setValueAtTime(392, context.currentTime)
        oscillator.frequency.setValueAtTime(349.23, context.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(329.63, context.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, context.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)
        oscillator.start(context.currentTime)
        oscillator.stop(context.currentTime + 0.5)
        break
      case 'click':
        oscillator.frequency.setValueAtTime(800, context.currentTime)
        gainNode.gain.setValueAtTime(0.2, context.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1)
        oscillator.start(context.currentTime)
        oscillator.stop(context.currentTime + 0.1)
        break
    }
  }

  return {
    playSound
  }
}
import ChatBase from "./ChatBase"

export function jsApiMethod() {
  
  return function (target: ChatBase<any>, prop: string, descriptor: PropertyDescriptor) {
    
    const originalMethod = descriptor.value
    
    descriptor.value = function (this: ChatBase<any>, ...args: any[]) {
      if (this.loaded) return originalMethod.apply(this, args)
      if (prop.startsWith('is')) return false
      if (prop == 'state') return ''
      if (prop == 'visitorData') return {}
      return new Promise(resolve => {
        this.on('load', () => resolve(originalMethod.apply(this, args)))
      })
    }
    
    return descriptor
    
  }
  
}

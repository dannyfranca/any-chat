<h1 align="center">
    dannyfranca/any-chat
</h1>
<p align="center">
    Universal, extensible and improved JS API for Chats, like TawkTo, Jivochat, and others.
</p>

<p align="center">

<a href="https://npmjs.com/package/@dannyfranca/any-chat" target="_blank">
    <img src="https://img.shields.io/npm/dt/@dannyfranca/any-chat.svg?style=flat-square&logo=npm" />
</a>

<a href="https://npmjs.com/package/@dannyfranca/any-chat" target="_blank">
    <img src="https://img.shields.io/npm/v/@dannyfranca/any-chat/latest.svg?style=flat-square&logo=npm" />
</a>

<a href="https://travis-ci.com/dannyfranca/any-chat" target="_blank">
    <img src="https://img.shields.io/travis/dannyfranca/any-chat?style=flat-square&logo=travis" />
</a>

<a href="https://codecov.io/gh/dannyfranca/any-chat" target="_blank">
    <img src="https://img.shields.io/codecov/c/github/dannyfranca/any-chat?style=flat-square&logo=codecov" />
</a>

<a href="https://david-dm.org/dannyfranca/any-chat" target="_blank">
    <img src="https://david-dm.org/dannyfranca/any-chat/status.svg?style=flat-square" />
</a>

</p>

## Getting Started

* Install dependency

```bash
yarn add any-chat
```

* Choose a built-in driver

```js
import TawkTo from 'any-chat/lib/chats/tawkto'
const tawkId = '5a16c7d3198bd56b8c03ce7e/1dijcq4nr'
const Chat = new TawkTo(tawkId)

chatLoaded()

async function chatLoaded() {
    await Chat.toLoad()
    console.log(Chat.loaded)
}
```

* Or extend ChatBase and build your own driver

```typescript
import ChatBase from "any-chat" // Base to build you Driver
import MethodMap from "any-chat/src/types/MethodMap" // Interface contract to guide 
import EventMap from "any-chat/src/types/EventMap" // Interface contract to you callback mapping
import { jsApiMethod } from "any-chat/src/core/decorators" // decorator to use in method mapping

class ChatDriver extends ChatBase<any> implements MethodMap {

    // constructor must execute init from abstract class
    constructor() {
        super()
        super.init()
    }

    // map callbacks
    _eventMap: EventMap = {
        load: '...',
        // ...
    }

    // write your loader
    _loader(): any {
          // ...
    }

    // Map methods
    @jsApiMethod()
    public async open(): Promise<void> {
        // ...
    }

    // see examples in any-chat/chats
}

export default ChatDriver
```

## Building Drivers

To better understand how this lib Works, look the examples in examples inside lib/chats folder.

Every methods are documented in abstract ChatBase and EventHandler. You can read the documentation generated with TypeDoc in [Docs](https://github.com/dannyfranca/any-chat/tree/master/docs)

## Warnings

This lib is being tested, better documentation arrives as the project evolves.

Feel free to open issues, help with pull requests or bounce ideas off each other.

## License

[MIT License](./LICENSE)

Copyright (c) Danny França <contato@dannyfranca.com>

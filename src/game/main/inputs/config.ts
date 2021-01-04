import hotkeys from "hotkeys-js";

const codes = {
    w: 87,
    d: 68,
    s: 83,
    a: 65,
    up: 38,
    right: 39,
    left: 37,
    down: 40,
}

type InputConfig = {
    keys: number[],
}

export const inputs: {
    [key: string]: InputConfig,
} = {
    up: {
        keys: [codes.w, codes.up],
    },
    down: {
        keys: [codes.s, codes.down],
    },
    left: {
        keys: [codes.a, codes.left],
    },
    right: {
        keys: [codes.d, codes.right],
    },
}

export const isKeyActive = (key: InputConfig): boolean => {
    let active = false
    key.keys.forEach((code) => {
        if (hotkeys.isPressed(code)) {
            active = true
        }
    })
    return active
}
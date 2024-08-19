// eventEmitter.js
import EventEmitter from 'eventemitter3';

const apiEventEmitter = new EventEmitter();

// Hàm để phát sự kiện
export const notifyLoginApiCalled = () => {
    apiEventEmitter.emit('loginApiCalled');
};

// Hàm để thiết lập listener cho sự kiện
export const setupListener = (callback) => {
    apiEventEmitter.on('loginApiCalled', callback);
    // Return a function to remove the listener
    return () => {
        apiEventEmitter.off('loginApiCalled', callback);
    };
};

export default apiEventEmitter;

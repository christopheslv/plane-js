class Browser {
    constructor() {
        this.update();
        window.addEventListener('resize', () => this.update(), false);
    }

    get safari(){
        return this._isSafari;
    }

    get mobile(){
        return this._isMobile;
    }

    get touchdevice(){
        return this._istouch;
    }

    get vpw(){
        return this._vpw;
    }

    get vph(){
        return this._vph;
    }

    get retina(){
        return this._isRetina;
    }

    update(){
        this._isSafari = false;
        this._isChrome = false;
        this._isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
        this._istouch = ("ontouchstart" in document.documentElement);

        this._vpw = window.innerWidth;
        this._vph = window.innerHeight;

        this._isRetina = window.devicePixelRatio > 1;
  
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
            if (ua.indexOf('chrome') > -1) {
                this._isChrome = true;
            } else {
                this._isSafari = true;
            }
        }
    }
}

const browser = new Browser();
export default browser;
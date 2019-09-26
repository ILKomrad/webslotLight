export default class EventProcessor {
    constructor(presenter, controller, container) {
        this.presenter = presenter;
        this.container = container;
        this.container = container;
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    onWindowResize() {
        if (window.innerWidth > (window.innerHeight * 16 / 9)) {
            this.container.style.width = window.innerHeight * 16 / 9 + 'px';
            this.container.style.height = window.innerHeight + 'px';
            this.presenter.setSize( this.container.clientHeight * 16 / 9, this.container.clientHeight );
        } else {
            this.container.style.width = window.innerWidth + 'px';
            this.container.style.height = window.innerWidth * 9 / 16 + 'px';
            this.presenter.setSize( this.container.clientWidth, this.container.clientHeight );
        }
    }
}
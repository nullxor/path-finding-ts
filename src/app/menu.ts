export class Menu {
    private hideMenu: HTMLButtonElement;
    private showMenu: HTMLButtonElement;
    private mainMenu: HTMLDivElement;

    constructor() {
        this.showMenu = <HTMLButtonElement>document.getElementById('showMenu');
        this.hideMenu = <HTMLButtonElement>document.getElementById('hideMenu');
        this.mainMenu = <HTMLDivElement>document.getElementById('mainMenu');
        this.hideEventHandler = this.hideEventHandler.bind(this);
        this.setupMenu();
    }

    show() {
        this.mainMenu.removeEventListener('animationend', this.hideEventHandler);
        this.mainMenu.classList.remove('hidden');
        this.mainMenu.classList.add('animated', 'fadeInLeft');
    }

    hide() {
        this.mainMenu.classList.add('animated', 'fadeOutLeft');
        this.mainMenu.addEventListener('animationend', this.hideEventHandler);
    }

    private hideEventHandler() {
        this.mainMenu.classList.add('hidden');
        this.mainMenu.classList.remove('animated', 'fadeOutLeft');
    }

    private setupMenu() {
        this.hideMenu.addEventListener('click', () => {
            this.hide();
        });
        this.showMenu.addEventListener('click', () => {
            this.show();
        });
    }
}
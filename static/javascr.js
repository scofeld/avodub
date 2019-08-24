;(function () {

    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

const timeForDeveloperCounter = 500;


(function () {
    function Counter(el, value, time){
        this.el = el;
        this.value = 0;
        this.to = value;
        this.time = time;
        this.interval = this.time / this.to < 25 ? 25 : this.time / this.to;
        this.increment = Math.floor(this.to / this.time * this.interval);
    }
    Counter.prototype.increase = function(){
        this.value += this.increment;
    };
    Counter.prototype.run = function(){
        var self = this;
        self.write();

        if(this.value === this.to) return false;

        setTimeout(function(){
            self.increase();
            self.run();
        }, this.interval )
    };
    Counter.prototype.write = function(){
        this.el.innerText = this.value;
    };

    let block = document.getElementById("counterBlock");
    let elements = block.querySelectorAll(".developer__counter-figure");
    let time = 1000;

    for(let i = 0, l = elements.length; i < l; i++){
        let el = elements[i];
        let to = +el.innerText;
        let counter = new Counter(el, to, time);
        counter.write();

        document.addEventListener('screen-change', function(e){
            if(e.detail.index === 3){
                setTimeout(function(){
                    counter.run();
                }, 1000);
            }
        })
    }


})();

var vh = window.innerHeight;
var scrollHeight = 900;
;(function(){
    let scrollableElement = document.getElementById('page'),
        lastBlock = document.getElementById("last-block");

    let enabled = false,
        index = 0,
        time = true,
        timeout;

    function movePage(){
        let y = index * (-100);
        scrollableElement.style.transform ="translate3d(0," + y + "vh,0)";
    }

    function findScrollDirectionOtherBrowsers(event) {
        let delta;

        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }

        if (delta < 0) {
            index++;
            if (index >= 9) {
                index = 9;
            }
            console.log("scrollup",index)
        } else if (delta > 0) {
            index--;
            if (index < 0) {
                index = 0;
            }
            console.log("scrollDown", index)
        }

        fireScreenChangeEvent();
        movePage();
    }

    function fireScreenChangeEvent(){
        let screenChangeEvent = new CustomEvent('screen-change', {
            detail: {
                index: index
            }
        });
        document.dispatchEvent(screenChangeEvent);
    }
/*
    function onWheelHandler(event){
        console.log('ddd');
        clearTimeout(timeout);
        if (time) {
            scrollableElement.removeEventListener('wheel', onWheelHandler);
            let lastBlockScroll = lastBlock.scrollTop;
            console.log(lastBlock.scrollTop);
            if (lastBlockScroll > 1) {
                return;
            }
            time = false;

            findScrollDirectionOtherBrowsers(event);

        }

        timeout = setTimeout(function () {
            time = true;
            scrollableElement.addEventListener('wheel', onWheelHandler, {
                passive: true
            });
        }, 200);


    }*/
    function onWheelHandler(event){
        let lastBlockScroll = lastBlock.scrollTop;
        if (lastBlockScroll > 0) {
            return;
        }
        if (time) {
            time = false;
            findScrollDirectionOtherBrowsers(event);
            console.log(lastBlock.scrollTop);
        } else {
            return;
        }
        setTimeout(function () {
            time = true;
            console.log("324324");
        }, 1000);
    }

    function getCurrentScreenIndex(){
        let screens = document.getElementById('page').children;
        for(let i = 0, l = screens.length; i < l; i++){
            let screen = screens[i];
            let rect = screen.getBoundingClientRect();
            if(rect.top < window.innerHeight && rect.bottom >= window.innerHeight) return i;
        }
    }

    function onScrollHandler(){
        let i = getCurrentScreenIndex();
        if(i !== index){
            index = i;
            fireScreenChangeEvent();
        }
    }

    function enableScreensSliding(){
        if(!enabled){
            index = 0;
            window.scrollTo(0, 0);
            document.body.style.overflow="hidden";
            scrollableElement.addEventListener('wheel', onWheelHandler, {
                passive: true
            });
            window.removeEventListener('scroll', onScrollHandler);
            enabled = true;
        }
    }

    function disableScreensSliding(){
        onScrollHandler();
        window.addEventListener('scroll', onScrollHandler);
        if(enabled) {
            document.body.style.overflow="auto";
            scrollableElement.removeAttribute('style');
            scrollableElement.removeEventListener('wheel', onWheelHandler);
            enabled = false;
        }
    }

    function update(){
        if(window.matchMedia('(max-width: 1100px), (max-height: 899px)').matches){
            disableScreensSliding();
        } else {
            enableScreensSliding();
        }
    }

    update();
    window.addEventListener('resize', function(){
        update();
    });
})();





var userWidth = window.innerWidth;
var body = document.body;

////main menu
(function(){
    menuOpened = false;
    let button = document.getElementById("mainMenuBtn");
    let sideMenu = document.getElementById("sideMenu");
    let hiddenMenu = document.getElementById("hiddenMenu");
    let closeMenu = function(){
        button.classList.remove("menu-btn--active");
        hiddenMenu.classList.remove("nav--active");
        if(userWidth < 768){
            body.style.overflow = "auto";
        }
            menuOpened = false;
    };
    let openMenu = function(){
        button.classList.add("menu-btn--active");
        hiddenMenu.classList.add("nav--active");
        console.log("open");
        if(userWidth < 768){
            setTimeout(function () {
                body.style.overflow = "hidden";
            },200);
        }
        menuOpened = true
    };
    button.addEventListener("click", function () {
        console.log(menuOpened);
        if(!menuOpened) {
            openMenu();

        }else{
            closeMenu();
            console.log("close")
        }
    });
    window.addEventListener("click", function (ev) {

        let targetEl = ev.target.closest("#hiddenMenu") || ev.target.closest("#mainMenuBtn");
        console.log(targetEl==null);
        if(targetEl == null && menuOpened ){
            closeMenu();
            console.log(targetEl);
        }


    });
    sideMenu.addEventListener("mouseover",function () {
        if(!menuOpened){
            button.classList.add("menu-btn--active");
            hiddenMenu.classList.add("nav--active");
            menuOpened = true;
        }else{
            return
        }
    });
    /*window.addEventListener("click",function(e){
        if(e.target != hiddenMenu || e.target != button){
            closeMenu();
        }
    })*/
})();
///callback pop up
(function () {

    let callPopUp = document.getElementById("callPopUp"),
        openCallPopUp = document.getElementById("openCallPopUp"),
        GaleryPopUp = document.getElementById("galeryPopUp"),
        openGaleryPopUp = document.getElementById("openGaleryPopUp"),
        developerPopUp = document.getElementById("developerPopUp"),
        developerButtons = document.querySelectorAll(".developer__slider-item-btn");

    let PopUpInit = function(popup,setClass){
        console.log("i'm here");
        let self = this;
        self.popUp = popup;
        self.closeButton = self.popUp.querySelector(".close-popup");
        self.class = setClass;
        self.closeButton.addEventListener("click", function () {
            self.popUp.classList.remove(setClass);
        })
    };
    function openPopUp(popup,setClass) {
          popup.classList.add(setClass);
    };
    let initCallPopup = new PopUpInit(callPopUp,"footer__popup--active");
    let rungaleryPopUpAll = new PopUpInit(galeryPopUp,"galery__galery-popup--active");
    let runDeveloperPopUp = new PopUpInit(developerPopUp,"developer__popup--active");

    window.addEventListener("click",function (e) {
        if(e.target.hasAttribute("data-galeryPopup")){
            openPopUp(galeryPopUp,"galery__galery-popup--active");
        }
        if(e.target.hasAttribute("data-callBackPopup")){
            openPopUp(callPopUp,"footer__popup--active");
        }
        if(e.target.hasAttribute("data-developerPopup")){
            openPopUp(developerPopUp,"developer__popup--active");
        }
    });
})();
/////developer
(function(){
    let block = document.getElementById("platinum");
    let el = block.querySelectorAll(".platinum__item");
    let btn = block.querySelectorAll(".platinum__item-btn");
    block.addEventListener("click",function (ev) {
        console.log(ev.target.parentElement);
        for (let i = 0,l = btn.length; i < l; i++){
            if(ev.target === btn[i] || ev.target.parentElement === btn[i]){
                el[i].classList.toggle("platinum__item--active");
            }
        }
    })
})();

//animate text

//sliders
(function(){
    var platinumSlider;
    if(vh > 899) {
        console.log("vh > 899");
        platinumSlider = new Swiper('.platinum__slider', {
            slidesPerView: 3,
            slidesPerColumn:2,
            pagination: {
                el: '.platinum__galery__swiper-counter',
                type: 'fraction',
            },
            // Navigation arrows
            navigation: {
                nextEl: '.platinum__slider-arrow--right',
                prevEl: '.platinum__slider-arrow--left',
            },
        });
        let buildingTech = new Swiper('.about-complex__building-tech', {
            slidesPerView: 3,
            initialSlide:0,
            slidesPerColumn:2,
            simulateTouch:false,
        });
    }else{
        console.log("vh < 899");
         platinumSlider = new Swiper('.platinum__slider', {
             slidesPerView: 3,
             simulateTouch:true,
             pagination: {
                 el: '.platinum__galery__swiper-counter',
                 type: 'fraction',
             },
             allowTouchMove: false,
             // Navigation arrows
             navigation: {
                 nextEl: '.platinum__slider-arrow--right',
                 prevEl: '.platinum__slider-arrow--left',
             },
             breakpoints: {
                 1300: {
                     initialSlide: 0,
                     slidesPerView: 2,
                     allowTouchMove: true,
                     centeredSlides: false,
                 },
                 768: {
                     slidesPerView: 1,
                     initialSlide: 0,
                     allowTouchMove: true,
                     centeredSlides: false,
                 }
             }
         });
        let buildingTech = new Swiper('.about-complex__building-tech', {

            slidesPerView: 3,
            slidesPerColumn: 2,
            initialSlide:0,
            breakpoints:{
                1300:{
                    simulateTouch: true,
                    slidesPerView: 2,
                    slidesPerColumn: 1,
                    centeredSlides:false,
                    initialSlide: 0,

                },
                768:{
                    initialSlide: 0,
                    slidesPerView: 1,

                }

            },
        });
    };
    var developerSlider1 = new Swiper('.developer__slider', {
        // Optional parameters
        slidesPerView: 3,
        spaceBetween: 5,
        initialSlide: 0,
        centeredSlides:true,
        loop:true,
        // If we need pagination
        pagination: {
            el: '.developer__galery__swiper-counter',
            type: 'fraction',
        },
        breakpoints:{
            1100:{
                centeredSlides: false,
                slidesPerView: 2,
            },
            768:{
                slidesPerView: 1,
                spaceBetween: 10,
            }
        },
        // Navigation arrows
        navigation: {
            nextEl: '.developer__btn-next',
            prevEl: '.developer__btn-prev',
        },
    });
    var slidegalery = new Swiper('.galery__slider', {
        slidesPerView: 1,
        speed: 500,
        initialSlide: 0,
        centeredSlides: true,
        pagination: {
            el: '.galery__swiper-counter',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.galery__slider-arrow--right',
            prevEl: '.galery__slider-arrow--left',
        }

    });
    var galeryPopUp = new Swiper('.galery-popup', {
        slidesPerView: 1,
        initialSlide: 0,
        centeredSlides:true,
        speed: 500,

        pagination: {
            el: '.galery__swiper-counter',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.galery-popup-right',
            prevEl: '.galery-popup-left',
        }
    });
    console.log("galery popup")
    var slideStockblock = new Swiper('.stock-block__slider', {
        speed: 500,
        longSwipes: false,
        slidesPerView: 2,
        initialSlide: 1,
        spaceBetween: 50,
        setWrapperSize: false,
        setTransition: 1,
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },

        // Navigation arrows

        navigation: {
            nextEl: '.stock-block__slider-main-arrow-right',
            prevEl: '.stock-block__slider-main-arrow-left',
        },
        breakpoints:{
            1419:{
                spaceBetween: 110,
                initialSlide: 0,
            },
            1100:{
                spaceBetween:50,
                initialSlide: 0,
            },
            768:{
                initialSlide: 0,
            }
        },
        //

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
    var reviewsSlider = new Swiper('.reviews__slider', {
        slidesPerView: 3,
        initialSlide: 0,
        spaceBetween: 7,
        setTransition: 500,
        loop:true,
        centeredSlides: true,
        // If we need pagination
        pagination: {
            el: '.galery__swiper-counter',
            type: 'fraction',
        },
        breakpoints:{
            1100:{
                slidesPerView: 2,
                centeredSlides:false,
            },
            768:{
                slidesPerView: 1,
                spaceBetween: 10,
            }
        },

        // Navigation arrows
        navigation: {
            nextEl: '.slide-next',
            prevEl: '.slide-prev',
        },
    });
    var slideNewBlog = new Swiper('.newsBlog__slider', {
        loop: true,
        slidesPerView: 3,
        init: true,
        centeredSlides:true,
        initialSlide: 0,
        spaceBetween: 16,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        breakpoints:{
          1100:{
              slidesPerView: 2,
              centeredSlides:false,
              initialSlide: 0,
          },
            768:{
                initialSlide: 0,
            }

        },
        // Navigation arrows
        navigation: {
            nextEl: '.newsBlog__slider-arrow-right',
            prevEl: '.newsBlog__slider-arrow-left',
        },
    });

    if(userWidth < 768){
        slideNewBlog.destroy(true, false);
        slideStockblock.destroy(true, false);

    }
})();





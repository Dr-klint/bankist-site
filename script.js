'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

[...btnsOpenModal].forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////
////////SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  ////////SCROLLING
  section1.scrollIntoView({ behavior: 'smooth' });

  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
});

//////////////////////////////////////////////////////
///////////////////////////////////
///EVENT DELEGATION: IMPLENTING PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

////USING EVENT DELEGATION
/// 1. add event listner to the common parent element
/// 2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////
/////////////////////////////////////////
//////TABBED COMPONENT

/*
///OLD PRACTISE
tabs.forEach(t =>
  t.addEventListener('click', () => console.log(`old practise`))
);
*/

///NEW FAST PRACTISE
tabsContainer.addEventListener('click', function (e) {
  // if (e.target.classList.contains('operations__tab')) {
  //   console.log(`new practise`);
  // }
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //GUARD CLAUSE
  if (!clicked) return;

  //  Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Active Content Area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////
//PASSING ARGUMENTS TO EVENT HANDLERS

//mouse enter is different from mouse over in that mouse enter doesnt bubble
///MENU FADE ANIMATIONS

const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');
    // const logo = document.querySelector('.nav__logo');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

//passing "argument" to handler function
nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

/////////////////////////////////////////////////////////
/////////////////////////////////////////
//STICKY NAV: INTERSECTION OBSERVATION API: allows observation of how a target element intersects another element or how it intersects the view port
/*
const obsCallBack = function (entries, observer) {}; //entries are an array of the threshold

const obsOption = {
  root: null, //root is the element, the target is intersecting, using null allows to
  threshold: [0, 0.2], //percentage of intersection by which the function will be called, it is usually in the form of an array
};

const observer = new IntersectionObserver(obsCallBack, obsOption); //it takes in a function and an object
observer.observe(section1);
*/
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  //entries[0] is intersectionObseverEntry
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //it represents a box of pixes that wil be applied outside of our target
});
headerObserver.observe(header);
/*
/////////////////////////////////////////////////////////
/////////////////////////////////////////
//STICKY NAV
const initialCordinates = section1.getBoundingClientRect();
console.log(initialCordinates);
window.addEventListener('scroll', function () {
  console.log(this.window.scrollY);
  if (window.scrollY > initialCordinates.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/
/////////////////////////////////////////////////////////
/////////////////////////////////////////
//REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);

  //MY DESIGN
  // if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
  // else entry.target.classList.add('section--hidden');
};

const observeSection = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  observeSection.observe(section);
  // section.classList.add('section--hidden');
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////
//LAZY LOADING IMAGES
const imgTarget = document.querySelectorAll('img[data-src');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //REPLACE SRC WITH DATA-SRC
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////////////////
/////////////////////////////////////////
//SLIDE
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  ////FUNCTIONS
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };
  //0,100,200,300

  //TO MOVE NEXT SLIDE
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
    //-100,0,100,200
  };

  //TO MOVE PREVIOUS SLIDE
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
    //
  };

  ///////////initialization
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };

  init();
  ///EVENT HANDLERS
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; //destructuing
      goToSlide(slide);
      activateDots(slide);
    }
  });
};
slider();

/*
/////////////////////////////////////////////////////////
/////////////////////////////////////////
//SELECTING, CREATING AND DELETING ELEMENTS

///SELECTING AN ELEMENT
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section'); //returns a nodelist
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); //returns an html collection which changes based on changes in the code
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); //returns a live html collection

/*
///CREATING AND INSERTING AN ELEMENT
// .insertAdjacentHtml()
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = `we use cookies for improved functionality and analytics`;
message.innerHTML = `we use cookies for improved functionality and analytics. <buttons class='btn btn--close-cookie'>Got it!</buttons>`;

///APPEND AND PREPEND, they are formed as child elements inside the elements they are called and create a live element which can't be at two places at the same time

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true)); //clone node allows a live element to exist at two points

/////BEFORE AND AFTER, they are formed as sibling elements to the element they are called and create a live element which can't be at two places at the same time

// header.before(message);
// header.after(message);

//////////DELETING ELEMENTS
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });
/*
////////////////////////////////////////////////////////////
////////////STYLES, ATTRIBUTES AND CLASSES
///STYLES: they are called in-line styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//console.log only shows styles that are in-line
console.log(message.style.width);
console.log(message.style.color);

////we therefore use:
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = `${
  Number.parseFloat(getComputedStyle(message).height, 10) + 30
}px`;

/////////SETTING CUSTOM PROPERTY
document.documentElement.style.setProperty('--color-primary', 'orangered'); //document.document.element = root

////////ATTRIBUTES: things that make up an element]

///STANDARD ATTRIBUTE
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

////////SETTING ATTRIBUTES
logo.alt = 'minimalist beautiful logo';
console.log(logo.alt);

///NON-STANDARD
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'bankist');
console.log(logo.getAttribute('company'));

///ABSOLUTE AND RELATIVE LINKS
console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

////DATA ATTRIBUTES
console.log(logo.dataset.versionNumber);

////////////////CLASSES
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes

//Dont use
logo.className = 'Jonas';
*/

/*
//////////////////////////////////////////////////////
///////////////////////////////////
///TYPES OF EVENTS AND HANDLERS

////MOUSE ENTER
const h1 = document.querySelector('h1');

////HOW TO MAKE AN EVENT RUN ONCE
const alertH1 = function (e) {
  alert(`add eventlistner : great, you are reading the heading`);

  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => {
  h1.removeEventListener('mouseenter', alertH1);
}, 3000);

// h1.onmouseenter = function (e) {
//   alert(`mouse eventlistner : great, you are reading the heading`);
// };

//////////////////////////////////////////////////////
///////////////////////////////////
///EVENT PROPAGATION: CAPTURING AND BUBBLING :Event handlers picks events in the propagation and capturing phase of the current target and their child element
//rgb(255,255,255)

const randomInt = (min, max) => Math.round(Math.random() * (max - min) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('link', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  ///Stop propagation
  e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('Nav', e.target, e.currentTarget);
  },
  true
); //setting the event handler to true makes it listen to event in the capturing phase, as it goes down the DOM


//////////////////////////////////////////////////////
///////////////////////////////////
///DOM TRANSVERSING: moving around in the DOM

const h1 = document.querySelector('h1');

//GOING DOWNWARDS : CHILD ELEMENT, it can select any child, irrespective of how deep it is

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //to get direct children of an element involving all kinds of nodes
console.log(h1.children); //produces a live html collection, it is used to get all direct children element
h1.firstElementChild.style.color = `white`;
h1.lastElementChild.style.color = `orangered`;

//GOING UPWARDS : PARENT ELEMENT
console.log(h1.parentNode); //produces direct parent node
console.log(h1.parentElement); //produces direct parent element

///closest works like a query selector but finds parent element no matter how far it is in the DOM tree
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//GOING SIDEWAYS : SIBLING ELEMENT, we can only access direct siblings i.e just previous and next

//sibling element
console.log(h1.nextElementSibling);
console.log(h1.previousElementSibling);

//node sibling
console.log(h1.nextSibling);
console.log(h1.previousSibling);

//getting all the sibling element
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el =>
  el !== h1 ? (el.style.transform = `scale(0.5)`) : console.log(h1)
);

/////////////////////////////////////////
//////////DOM LIFECYCLE
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
}); //it is fired by the document as soon as the html is completely parsed i.e all the documents (html and javascript) are fully downloaded

window.addEventListener('load', function (e) {
  console.log(`page fully loaded`, e);
}); //it is fired by the windows as soon as both the html,css files, the images and other external resources are fully loaded

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// }); //it is fired by the windows as soon as the user wants to leave the page
*/

$(function () {
  $('.navbar-button').click(function () {
    $('.navlinks').toggleClass('navlinks-mobile');
    $('.all-screens').toggleClass('all-screens-off');
    $('header').toggleClass('header-mobile');
    $('.topLine').toggleClass('top-opened');
    $('.middleLine').toggleClass('middle-opened');
    $('.bottomLine').toggleClass('bottom-opened');
    $('section').toggleClass('section-off');
  })
});

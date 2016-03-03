(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/MacBookPro/projects/blog/app/assets/javascripts/_stream_0.js":[function(require,module,exports){
(function() {
  var $commentContent, $comments, $commentsCount, $emailInput, $newCommentForm, $submitComment, $usernameInput, checkValid, clearForm, commentsCount, incCommentsCount, initSubmitComment, isSending, removeTitle, showComment, utils;

  utils = require("./utils.coffee");

  $submitComment = $('#submit-new-comment');

  $newCommentForm = $('#new-comment-form');

  $comments = $('div.comments:eq(0)');

  $emailInput = $newCommentForm.find('input[name=email]:eq(0)');

  $usernameInput = $newCommentForm.find('input[name=name]:eq(0)');

  $commentContent = $newCommentForm.find('textarea[name=content]:eq(0)');

  isSending = false;

  $commentsCount = $('span.count:eq(0)');

  commentsCount = parseInt($commentsCount.html());

  initSubmitComment = function() {
    return $("#submit-new-comment").click(function(event) {
      var data, req;
      event.preventDefault();
      if (isSending) {
        return;
      }
      data = $newCommentForm.serializeObject();
      if (!checkValid(data)) {
        return;
      }
      isSending = true;
      req = $.ajax({
        url: "/comments.json",
        type: "POST",
        data: data
      });
      req.success(function(comment) {
        isSending = false;
        showComment($(comment.html));
        incCommentsCount();
        return clearForm();
      });
      return req.error(function(error) {
        isSending = false;
        return alert("表单填写不正确");
      });
    });
  };

  checkValid = function(data) {
    var EMAIL_REG, NAME_RE, ref;
    EMAIL_REG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    NAME_RE = /^[_\w\d\u4e00-\u9fa5]{2,31}$/i;
    if (!EMAIL_REG.test(data.email)) {
      utils.shake($emailInput);
      return false;
    }
    if (!NAME_RE.test(data.name)) {
      utils.shake($usernameInput);
      return false;
    }
    if (!((1 <= (ref = data.content.length) && ref <= 140))) {
      utils.shake($commentContent);
      return false;
    }
    return true;
  };

  incCommentsCount = function() {
    return $commentsCount.text(++commentsCount);
  };

  clearForm = function() {
    return $newCommentForm.find('textarea:eq(0)').val('');
  };

  showComment = function($comment) {
    $comments.prepend($comment);
    $comment.hide();
    return $comment.fadeIn(1000);
  };

  removeTitle = function() {
    return $("head title").remove();
  };

  initSubmitComment();

  removeTitle();

}).call(this);

},{"./utils.coffee":"/Users/MacBookPro/projects/blog/app/assets/javascripts/utils.coffee"}],"/Users/MacBookPro/projects/blog/app/assets/javascripts/utils.coffee":[function(require,module,exports){
var utils;

utils = {};

$.fn.serializeObject = function() {
  var a, o;
  o = {};
  a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      return o[this.name].push(this.value || '');
    } else {
      return o[this.name] = this.value || '';
    }
  });
  return o;
};

utils.ajax = function(data) {
  if (data.data) {
    data.data = JSON.stringify(data.data);
    data.contentType = 'application/json';
  }
  return $.ajax(data);
};

utils.getError = function(error) {
  return error.responseJSON.error[0];
};

utils.parseTagsStr = function(tagsStr) {
  if (tagsStr) {
    return tagsStr.replace(/[;；]$/, '').split(/[;；]/g);
  } else {
    return [];
  }
};

utils.shake = function($dom) {
  var count, dur, shake;
  if ($dom.css('position') === 'static') {
    $dom.css('position', 'relative');
  }
  $dom.focus();
  dur = 80;
  count = 0;
  if ($dom.isRunning) {
    return;
  }
  $dom.isRunning = true;
  shake = function() {
    var dist;
    count++;
    dist = 5;
    if (count === 3) {
      $dom.isRunning = false;
      return;
    }
    return $dom.animate({
      'left': "-=" + dist + "px"
    }, dur, function() {
      return $dom.animate({
        'left': "+=" + (2 * dist) + "px"
      }, dur, function() {
        return $dom.animate({
          'left': "-=" + dist + "px"
        }, dur, shake);
      });
    });
  };
  return shake();
};

module.exports = utils;

},{}]},{},["/Users/MacBookPro/projects/blog/app/assets/javascripts/_stream_0.js"]);

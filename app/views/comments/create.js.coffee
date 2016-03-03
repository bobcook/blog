<% if @comment.errors.size.zero? %>
  $("#comments").prepend '<%= render @comment %>'
<% else %>
  alert('Error creating comments')
<% end %>

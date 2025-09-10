class ApplicationController < ActionController::Base
  def current_user
    # return the actual user or a guest
    logged_in_user || guest_user
  end

  def logged_in_user
    # return the actual logged in user if they exist
    defined?(super) ? super : nil
  end

  private

  def guest_user
    # if the guest session is exists, then return that user
    return User.find(session[:guest_user_id]) if session[:guest_user_id].nil? == false

    # else, create a new user, set that user's session id as the session id, and return that user
    guest_id = create_guest_user.id
    session[:guest_user_id] = guest_id
    User.find(guest_id)
  end

  def create_guest_user
    guest_user = User.create(guest: true, password: guest_user_password, email: guest_user_email)
    guest_user.save(validate: false)
    guest_user
  end

  # creates a guest user email with in the form Time.now.to_i}
  def guest_user_email
    "guest_#{Time.now.to_i}#{rand(99)}@example.com"
  end

  # creates an alphanumeric string
  def guest_user_password
    password_length = 6
    (0...password_length).map { rand(65..90).chr }.join
  end
end

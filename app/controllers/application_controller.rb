class ApplicationController < ActionController::Base
  def current_user
    create_guest_user
  end

  private

  def create_guest_user
    u = User.create(password: 'foobar', email: "guest_#{Time.now.to_i}#{rand(99)}@example.com")
    u.save(validate: false)
    u
  end
end

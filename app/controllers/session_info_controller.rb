# frozen_string_literal: true

# controller is a subset of application controller, so all global styles will apply to the text stylings here
class SessionInfoController < ApplicationController
  def link_path
    context_display('/users/sign_out', '/users/sign_in')
  end

  def link_text
    context_display('Log Out', 'Log In/Register')
  end

  private

  def context_display(signed_in, signed_out)
    return signed_in if user_signed_in?

    signed_out
  end
end

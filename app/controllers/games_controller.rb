# frozen_string_literal: true

class GamesController < ApplicationController
  def show
    # dummy object or Game.find(params[:id])
  end

  # method
  def user_prompt_controls
    # information hidden
    # any detection of user agent or device type
    # preconditions
    # --The app is running
    # --the device_detection gem is installed
    # postconditions
    #   The string is of one of two states:
    #    message for desktop-based
    #    message for tablet based controls
    #  # inputs: none
    # outputs: returns a string
    'Test Controller'
  end
  helper_method :user_prompt_controls
end

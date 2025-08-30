# frozen_string_literal: true

# reqiure the device detector
require 'device_detector'
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
    #  #get the user agent
    user_agent = request.user_agent
    # expect the user agent string displays as the output
    #  # create a device detector object from the user agent
    client = DeviceDetector.new(user_agent)
    #  # create a result message that defaults to mobile
    message = 'Tap to turn'
    #  # if the device type is desktop, set the result to a message for arrow keys
    message = 'Use arrow keys to turn' if client.device_type == 'desktop'
    # return the result message
    message
  end
  helper_method :user_prompt_controls
end

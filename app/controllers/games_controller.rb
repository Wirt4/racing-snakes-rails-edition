# frozen_string_literal: true

# reqiure the device detector
require 'device_detector'
class GamesController < ApplicationController
  def show
    # dummy object or Game.find(params[:id])
  end

  # Determines the correct user prompt based on device type, helper method to be used in view
  #
  # @return [String] message detailing appropriate user instructions
  def user_prompt_controls
    #      postconditions
    #        The string is of one of two states:
    #         message for desktop-based
    #         message for tablet based controls

    # create a device detector object from the user agent
    client = DeviceDetector.new(request.user_agent)
    #  default message is for mobile
    message = 'Tap to turn'
    #  if the device type is desktop, set the result to a message for arrow keys
    message = 'Use Arrow Keys to Turn' if client.device_type == 'desktop'

    message
  end
  helper_method :user_prompt_controls
end

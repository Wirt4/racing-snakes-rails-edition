# frozen_string_literal: true

require 'device_detector'
# controller for the Games view. At present, the core logic of the game is housed in the TypeScript application
class GamesController < ApplicationController
  # don't allow un-sessioned users in
  before_action :authenticate_user!

  def show
    # dummy object or Game.find(params[:id])
  end

  # Determines the correct user prompt based on device type, helper method to be used in view
  #
  # @return [String] message detailing appropriate user instructions
  def user_prompt_controls
    #      postconditions
    #        The string is of one of three states:
    #         message for desktop-based
    #         message for tablet or phone based controls
    #         empty string for unrecognized browser types

    device = DeviceDetector.new(request.user_agent).device_type
    # (a "phablet" is a marketing term for a larger smart phone)
    if %w[smartphone tablet phablet].include?(device)
      'Tap to Turn'
    elsif device == 'desktop'
      'Use Arrow Keys to Turn'
    else
      ''
    end
  end
  helper_method :user_prompt_controls
end

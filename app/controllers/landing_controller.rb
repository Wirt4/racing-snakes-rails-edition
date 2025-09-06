# frozen_string_literal: true

# Controller for the landing page
class LandingController < ApplicationController
  def index
    @game = 1 # TODO: expand game logic when records are necessary
  end
end

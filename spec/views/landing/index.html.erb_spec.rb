# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'landing/index.html.erb', type: :view do
  it 'shows the sign up link' do
    assign(:game, [Game.new(id: 1, title: 'Test Game')])

    render

    expect(rendered).to include('Play Now!')
    expect(rendered).to include('href="/games/1"')
  end
end

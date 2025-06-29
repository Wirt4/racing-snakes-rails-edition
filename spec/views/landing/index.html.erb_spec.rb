require 'rails_helper'

RSpec.describe 'landing/index.html.erb', type: :view do
  it 'shows the sign up link' do
    render
    expect(rendered).to include('Play Now!')
    expect(rendered).to include('href="/play"')
  end
end

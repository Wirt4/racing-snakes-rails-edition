require 'rails_helper'

RSpec.describe GamesController, type: :controller do
  it 'returns a desktop-specific controls prompt' do
    # mock a desktop browser
    desktop = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5)'
    allow(request).to receive(:user_agent).and_return(desktop)
    # call the user_prompt_controls method
    message = controller.user_prompt_controls
    # expect the message to be 'Use Arrow Keys to Turn'
    expect(message).to eq('Use Arrow Keys to Turn')
  end
  it 'returns a mobile-specific controls prompt' do
    # mock a mobile browser
    phone = 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
    allow(request).to receive(:user_agent).and_return(phone)
    # call user_prompt controls
    message = controller.user_prompt_controls
    # expect the message to be 'Tap to Turn'
    expect(message).to eq('Tap to Turn')
  end
end

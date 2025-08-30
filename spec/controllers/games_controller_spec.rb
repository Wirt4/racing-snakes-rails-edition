require 'rails_helper'

def mock_user_agent(agent_string)
  allow(request).to receive(:user_agent).and_return(agent_string)
end

RSpec.describe GamesController, type: :controller do
  it 'returns a desktop-specific controls prompt' do
    # mock a desktop browser
    desktop = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5)'
    mock_user_agent(desktop)
    # call the user_prompt_controls method
    message = controller.user_prompt_controls
    # expect the message to be 'Use Arrow Keys to Turn'
    expect(message).to eq('Use Arrow Keys to Turn')
  end
  it 'returns a phone-specific controls prompt' do
    # mock a mobile browser
    phone = 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
    mock_user_agent(phone)
    # call user_prompt controls
    message = controller.user_prompt_controls
    # expect the message to be 'Tap to Turn'
    expect(message).to eq('Tap to Turn')
  end
  it 'returns a tablet-specific controls prompt' do
    # mock a mobile browser
    tablet = 'Mozilla/5.0 (Android 4.4; Tablet; rv:41.0) Gecko/41.0 Firefox/41.0'
    mock_user_agent(tablet)
    # call user_prompt controls
    message = controller.user_prompt_controls
    # expect the message to be 'Tap to Turn'
    expect(message).to eq('Tap to Turn')
  end
end

# frozen_string_literal: true

require 'rails_helper'

def mock_user_agent(agent_string)
  allow(request).to receive(:user_agent).and_return(agent_string)
end

RSpec.describe 'confirm class type' do
  # the games controller is an instance of the application controller,
  it 'a games controller is an application controller' do
    games = GamesController.new
    expect(games).to be_a ApplicationController
  end
  it 'a games controller is not a sessionInfo controller' do
    # users still need to be authenticated for access, but don't need the logout headers on the page
    games = GamesController.new
    expect(games).not_to be_a SessionInfoController
  end
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
    phone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    mock_user_agent(phone)
    # call user_prompt controls
    message = controller.user_prompt_controls
    # expect the message to be 'Tap to Turn'
    expect(message).to eq('Tap to Turn')
  end
  it 'returns a tablet-specific controls prompt' do
    # mock a tablet browser
    tablet = 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    mock_user_agent(tablet)
    # call user_prompt controls
    message = controller.user_prompt_controls
    # expect the message to be 'Tap to Turn'
    expect(message).to eq('Tap to Turn')
  end
  it "Does not prompt if it can't recognize the browser" do
    # mock a smart speaker
    speaker = 'Mozilla/5.0 (Linux; <Android version>) AppleWebKit/537.36 (KHTML, like Gecko)'
    mock_user_agent(speaker)
    message = controller.user_prompt_controls
    # message should be an empty string -- don't want to change types if can help it
    expect(message).to eq('')
  end
end

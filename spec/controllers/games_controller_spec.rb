require 'rails_helper'
# mock a mobile browser
# create a games controller
# call user_prompt controls
# expect the message to be 'tap to move'
RSpec.describe GamesController, type: :controller do
  it 'returns a desktop-specific controls prompt' do
    # mock a desktop browser
    allow(request).to receive(:user_agent).and_return('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5)')
    # call the user_prompt_controls method
    message = controller.user_prompt_controls
    # expect the message to be 'Use Arrow Keys to Turn'
    expect(message).to eq('Use Arrow Keys to Turn')
  end
end

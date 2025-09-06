# frozen_string_literal: true

# the landing controller should be a child of the session info controller
RSpec.describe 'Landing Controller tests' do
  it 'should be an instance of SessionInfoController' do
    landing = LandingController.new
    expect(landing).to be_a SessionInfoController
  end
end

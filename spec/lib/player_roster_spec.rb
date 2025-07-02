require_relative '../../app/lib/racing_snakes'

RSpec.describe RacingSnakes::PlayerRoster do
  let(:roster) { described_class.new }
  describe '#initialize' do
    it 'inherits from AbstractPlayerRoster' do
      expect(roster).to be_a(RacingSnakes::AbstractPlayerRoster)
    end
  end
end

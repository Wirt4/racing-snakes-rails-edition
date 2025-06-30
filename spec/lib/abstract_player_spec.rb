require_relative '../../app/lib/racing_snakes'
RSpec.describe RacingSnakes::AbstractPlayer do
  describe '#initialize' do
    it 'requires the player ID to be a string' do
      expect do
        described_class.new(-1)
      end.to raise_error(ArgumentError, /player id must be a string/)
    end
  end
end

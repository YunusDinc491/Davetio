using System.Security.Cryptography;

namespace TeklifUygulaması.Services
{
    public static class SlugGenerator
    {
        private const string Alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";

        public static string New(int length = 6)
        {
            var bytes = RandomNumberGenerator.GetBytes(length);
            var chars = new char[length];
            for (int k = 0; k < length; k++)
                chars[k] = Alphabet[bytes[k] % Alphabet.Length];
            return new string(chars);
        }
    }
}